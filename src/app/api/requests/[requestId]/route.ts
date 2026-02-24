// src/app/api/requests/[requestId]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]),
  workerNotes: z.string().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { requestId } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { worker: true },
  })
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Validar permisos según el nuevo estado
  const { status, workerNotes } = parsed.data
  const isWorker = request.worker.userId === session.user.id
  const isClient = request.clientId === session.user.id

  const workerActions = ["ACCEPTED", "REJECTED", "COMPLETED"]
  const clientActions = ["CANCELLED"]

  if (workerActions.includes(status) && !isWorker) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (clientActions.includes(status) && !isClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Validar transiciones de estado
  const validTransitions: Record<string, string[]> = {
    PENDING:   ["ACCEPTED", "REJECTED", "CANCELLED"],
    ACCEPTED:  ["COMPLETED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
  }

  if (!validTransitions[request.status]?.includes(status)) {
    return NextResponse.json(
      { error: `No se puede pasar de ${request.status} a ${status}` },
      { status: 400 }
    )
  }

  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status,
      ...(workerNotes && { workerNotes }),
    },
  })

  // Si se completó, actualizar el rating promedio del worker
  if (status === "COMPLETED") {
    const reviews = await prisma.review.aggregate({
      where: { revieweeId: request.worker.userId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await prisma.workerProfile.update({
      where: { id: request.workerId },
      data: {
        ratingAvg: reviews._avg.rating ?? 0,
        totalReviews: reviews._count.rating,
      },
    })
  }

  return NextResponse.json(updated)
}
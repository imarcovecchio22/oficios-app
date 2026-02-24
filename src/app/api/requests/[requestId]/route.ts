import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]),
  workerNotes: z.string().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { requestId } = await params
  const body = await req.json()
  const parsed = updateStatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { worker: true },
  })

  if (!request) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  // Validar permisos según rol
  const isWorker = request.worker.userId === session.user.id
  const isClient = request.clientId === session.user.id

  const { status, workerNotes } = parsed.data

  if ((status === "ACCEPTED" || status === "REJECTED" || status === "COMPLETED") && !isWorker) {
    return NextResponse.json({ error: "Solo el trabajador puede realizar esta acción" }, { status: 403 })
  }

  if (status === "CANCELLED" && !isWorker && !isClient) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  // Validar transiciones de estado
  const validTransitions: Record<string, string[]> = {
    PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
    ACCEPTED: ["COMPLETED", "CANCELLED"],
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
    data: { status, workerNotes },
  })

  return NextResponse.json(updated)
}

// src/app/api/reviews/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createReviewSchema = z.object({
  requestId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Solo clientes pueden calificar" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const { requestId, rating, comment } = parsed.data

  // Verificar que el trabajo existe, está completado y le pertenece al cliente
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { worker: true, review: true },
  })

  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  }
  if (request.clientId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (request.status !== "COMPLETED") {
    return NextResponse.json({ error: "Solo se puede calificar trabajos completados" }, { status: 400 })
  }
  if (request.review) {
    return NextResponse.json({ error: "Ya calificaste este trabajo" }, { status: 409 })
  }

  // Crear la review
  const review = await prisma.review.create({
    data: {
      requestId,
      reviewerId: session.user.id,
      revieweeId: request.worker.userId,
      rating,
      comment,
    },
  })

  // Recalcular rating promedio del trabajador
  const stats = await prisma.review.aggregate({
    where: { revieweeId: request.worker.userId },
    _avg: { rating: true },
    _count: { rating: true },
  })

  await prisma.workerProfile.update({
    where: { id: request.workerId },
    data: {
      ratingAvg: Math.round((stats._avg.rating ?? 0) * 10) / 10,
      totalReviews: stats._count.rating,
    },
  })

  return NextResponse.json(review, { status: 201 })
}

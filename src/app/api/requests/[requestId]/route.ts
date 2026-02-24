// src/app/api/requests/[requestId]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import {
  sendRequestAcceptedEmail,
  sendRequestRejectedEmail,
  sendReviewRequestEmail,
} from "@/services/notification.service"

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
    include: {
      worker: {
        include: {
          user: { select: { fullName: true, email: true, phone: true } },
        },
      },
      client: { select: { fullName: true, email: true } },
    },
  })
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

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
    data: { status, ...(workerNotes && { workerNotes }) },
  })

  // Recalcular rating si se completó
  if (status === "COMPLETED") {
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
  }

  // Disparar emails de forma asíncrona (sin bloquear la respuesta)
  try {
    if (status === "ACCEPTED") {
      await sendRequestAcceptedEmail({
        clientEmail: request.client.email,
        clientName: request.client.fullName,
        workerName: request.worker.user.fullName,
        workerPhone: request.worker.user.phone,
        requestedDate: request.requestedDate,
        requestedTimeSlot: request.requestedTimeSlot,
        requestId,
      })
    }

    if (status === "REJECTED") {
      await sendRequestRejectedEmail({
        clientEmail: request.client.email,
        clientName: request.client.fullName,
        workerName: request.worker.user.fullName,
      })
    }

    if (status === "COMPLETED") {
      await sendReviewRequestEmail({
        clientEmail: request.client.email,
        clientName: request.client.fullName,
        workerName: request.worker.user.fullName,
        requestId,
      })
    }
  } catch (emailError) {
    // El email falla silenciosamente — no rompemos el flujo principal
    console.error("[EMAIL_ERROR]", emailError)
  }

  return NextResponse.json(updated)
}
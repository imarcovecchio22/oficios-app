import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createRequestSchema = z.object({
  workerId: z.string(),
  description: z.string().min(10),
  requestedDate: z.string(),
  requestedTimeSlot: z.string(),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  if (session.user.role === "WORKER") {
    const worker = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!worker) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })

    const requests = await prisma.serviceRequest.findMany({
      where: {
        workerId: worker.id,
        ...(status && { status: status as any }),
      },
      include: {
        client: { select: { fullName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(requests)
  }

  if (session.user.role === "CLIENT") {
    const requests = await prisma.serviceRequest.findMany({
      where: {
        clientId: session.user.id,
        ...(status && { status: status as any }),
      },
      include: {
        worker: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(requests)
  }

  return NextResponse.json([])
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  if (session.user.role !== "CLIENT") return NextResponse.json({ error: "Solo clientes pueden solicitar" }, { status: 403 })

  const body = await req.json()
  const parsed = createRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })

  const { workerId, description, requestedDate, requestedTimeSlot } = parsed.data

  const worker = await prisma.workerProfile.findUnique({
    where: { id: workerId },
    include: { categories: true },
  })
  if (!worker) return NextResponse.json({ error: "Trabajador no encontrado" }, { status: 404 })

  const jobDate = new Date(requestedDate)
  const confirmationDeadline = new Date(jobDate.getTime() - 48 * 60 * 60 * 1000)

  const request = await prisma.serviceRequest.create({
    data: {
      clientId: session.user.id,
      workerId: worker.id,
      categoryId: worker.categories[0]?.id ?? "",
      description,
      requestedDate: jobDate,
      requestedTimeSlot,
      confirmationDeadline,
      status: "PENDING",
    },
  })

  return NextResponse.json({ id: request.id }, { status: 201 })
}
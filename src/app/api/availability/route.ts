// src/app/api/availability/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const slotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
})

const bodySchema = z.object({
  slots: z.array(slotSchema),
})

// Reemplaza toda la disponibilidad del worker
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "WORKER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const worker = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 })

  const body = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Transacción: borrar todo y recrear
  await prisma.$transaction([
    prisma.availabilitySlot.deleteMany({ where: { workerId: worker.id } }),
    prisma.availabilitySlot.createMany({
      data: parsed.data.slots.map((s) => ({ ...s, workerId: worker.id })),
    }),
  ])

  const slots = await prisma.availabilitySlot.findMany({
    where: { workerId: worker.id },
    orderBy: { dayOfWeek: "asc" },
  })

  return NextResponse.json(slots)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const workerId = searchParams.get("workerId")
  if (!workerId) return NextResponse.json({ error: "workerId required" }, { status: 400 })

  const slots = await prisma.availabilitySlot.findMany({
    where: { workerId },
    orderBy: { dayOfWeek: "asc" },
  })
  return NextResponse.json(slots)
}

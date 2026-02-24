// src/app/api/workers/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const { workerId } = await params
  const worker = await prisma.workerProfile.findUnique({
    where: { id : workerId },
    include: {
      user: { select: { fullName: true, avatarUrl: true, email: true } },
      categories: true,
      availability: { orderBy: { dayOfWeek: "asc" } },
    },
  })
  if (!worker) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(worker)
}

const updateSchema = z.object({
  bio: z.string().max(500).optional(),
  coverageZones: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { workerId } = await params
  const worker = await prisma.workerProfile.findUnique({ where: { id : workerId } })
  if (!worker || worker.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { bio, coverageZones, categoryIds } = parsed.data

  const updated = await prisma.workerProfile.update({
    where: { id: workerId },
    data: {
      ...(bio !== undefined && { bio }),
      ...(coverageZones !== undefined && { coverageZones }),
      ...(categoryIds !== undefined && {
        categories: {
          set: categoryIds.map((cid) => ({ id: cid })),
        },
      }),
    },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      categories: true,
    },
  })

  return NextResponse.json(updated)
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const { workerId } = await params

  const worker = await prisma.workerProfile.findUnique({
    where: { id: workerId },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      categories: true,
    },
  })

  if (!worker) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(worker)
}

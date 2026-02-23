import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const zone = searchParams.get("zone")

  const workers = await prisma.workerProfile.findMany({
    where: {
      isActive: true,
      ...(category && {
        categories: { some: { slug: category } },
      }),
      ...(zone && {
        coverageZones: { has: zone },
      }),
    },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      categories: true,
    },
    orderBy: { ratingAvg: "desc" },
  })

  return NextResponse.json(workers)
}

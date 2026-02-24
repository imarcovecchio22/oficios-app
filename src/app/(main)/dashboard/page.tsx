import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import WorkerDashboard from "@/components/workers/WorkerDashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role === "CLIENT") redirect("/search")

  const worker = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
    include: { categories: true },
  })

  if (!worker) redirect("/login")

  const requests = await prisma.serviceRequest.findMany({
    where: { workerId: worker.id },
    include: {
      client: { select: { fullName: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return <WorkerDashboard worker={worker} requests={requests} />
}
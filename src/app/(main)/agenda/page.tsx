// src/app/(main)/agenda/page.tsx
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import WeeklySchedule from "@/components/agenda/WeeklySchedule"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AgendaPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "WORKER") redirect("/search")

  const worker = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      availability: { orderBy: { dayOfWeek: "asc" } },
    },
  })
  if (!worker) redirect("/login")

  const initialSlots = worker.availability.map((s) => ({
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
  }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi agenda</h1>
          <p className="text-slate-500 mt-1">
            Configurá los días y horarios en que estás disponible.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile/edit">Editar perfil</Link>
        </Button>
      </div>

      <WeeklySchedule initialSlots={initialSlots} />
    </div>
  )
}

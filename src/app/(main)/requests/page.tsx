// src/app/(main)/requests/page.tsx
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente de respuesta", color: "bg-yellow-100 text-yellow-700" },
  ACCEPTED:  { label: "Aceptada", color: "bg-blue-100 text-blue-700" },
  REJECTED:  { label: "Rechazada", color: "bg-red-100 text-red-700" },
  CONFIRMED: { label: "Confirmada ✓", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Completada", color: "bg-slate-100 text-slate-600" },
  CANCELLED: { label: "Cancelada", color: "bg-red-50 text-red-400" },
  EXPIRED:   { label: "Expirada", color: "bg-slate-100 text-slate-400" },
}

export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "CLIENT") redirect("/dashboard")

  const requests = await prisma.serviceRequest.findMany({
    where: { clientId: session.user.id },
    include: {
      worker: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          categories: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis solicitudes</h1>
          <p className="text-slate-500 mt-1">Seguí el estado de tus contrataciones.</p>
        </div>
        <Button asChild>
          <Link href="/search">+ Nueva solicitud</Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-medium text-lg">Todavía no hiciste ninguna solicitud</p>
          <p className="text-sm mt-2 mb-6">Buscá un profesional y agendá tu primer servicio.</p>
          <Button asChild>
            <Link href="/search">Buscar profesional</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const status = STATUS_CONFIG[req.status]
            const workerName = req.worker.user.fullName
            const category = req.worker.categories[0]

            return (
              <Card key={req.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar del worker */}
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {category?.icon ?? "👷"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-slate-900">{workerName}</span>
                        {category && (
                          <span className="text-xs text-slate-400">{category.name}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status?.color}`}>
                          {status?.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(req.requestedDate).toLocaleDateString("es-AR", {
                            weekday: "long", day: "numeric", month: "long",
                          })} · {req.requestedTimeSlot}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">{req.description}</p>

                      {req.workerNotes && (
                        <p className="text-sm text-slate-500 mt-2 bg-slate-50 rounded-lg px-3 py-2">
                          💬 <span className="italic">{req.workerNotes}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/requests/${req.id}`}>Ver detalle</Link>
                      </Button>

                      {/* Si está completada y no tiene review, mostrar botón de calificar */}
                      {req.status === "COMPLETED" && (
                        <Button size="sm" asChild>
                          <Link href={`/reviews/new?requestId=${req.id}`}>
                            Calificar
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

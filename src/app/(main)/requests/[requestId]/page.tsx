import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente de respuesta", color: "bg-yellow-100 text-yellow-700" },
  ACCEPTED:  { label: "Aceptada", color: "bg-blue-100 text-blue-700" },
  REJECTED:  { label: "Rechazada", color: "bg-red-100 text-red-700" },
  CONFIRMED: { label: "Confirmada", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Completada", color: "bg-slate-100 text-slate-700" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
  EXPIRED:   { label: "Expirada", color: "bg-slate-100 text-slate-500" },
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      worker: {
        include: { user: { select: { fullName: true } } },
      },
      client: { select: { fullName: true } },
    },
  })

  if (!request) notFound()

  // Solo el cliente o el worker pueden ver la solicitud
  const isClient = request.clientId === session.user.id
  const isWorker = request.worker.userId === session.user.id
  if (!isClient && !isWorker) notFound()

  const status = STATUS_LABELS[request.status] ?? { label: request.status, color: "" }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Solicitud de servicio</h1>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Profesional</span>
              <span className="font-medium">{request.worker.user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cliente</span>
              <span className="font-medium">{request.client.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fecha</span>
              <span className="font-medium">
                {new Date(request.requestedDate).toLocaleDateString("es-AR", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Horario</span>
              <span className="font-medium">{request.requestedTimeSlot}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Descripción</p>
            <p className="text-sm text-slate-700">{request.description}</p>
          </div>

          {request.status === "PENDING" && isClient && (
            <p className="text-sm text-slate-400 text-center">
              Esperando respuesta del profesional...
            </p>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/search">Volver a búsqueda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

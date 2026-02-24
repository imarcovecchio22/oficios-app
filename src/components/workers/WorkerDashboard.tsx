"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Request = {
  id: string
  status: string
  description: string
  requestedDate: Date
  requestedTimeSlot: string
  workerNotes: string | null
  client: { fullName: string; email: string; phone: string | null }
}

type Worker = {
  id: string
  ratingAvg: number
  totalReviews: number
  categories: { name: string; icon: string | null }[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  ACCEPTED:  { label: "Aceptada", color: "bg-blue-100 text-blue-700" },
  REJECTED:  { label: "Rechazada", color: "bg-red-100 text-red-700" },
  CONFIRMED: { label: "Confirmada", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Completada", color: "bg-slate-100 text-slate-600" },
  CANCELLED: { label: "Cancelada", color: "bg-red-50 text-red-400" },
  EXPIRED:   { label: "Expirada", color: "bg-slate-100 text-slate-400" },
}

const TABS = [
  { key: "PENDING", label: "Pendientes" },
  { key: "ACCEPTED", label: "Aceptadas" },
  { key: "CONFIRMED", label: "Confirmadas" },
  { key: "COMPLETED", label: "Completadas" },
]

export default function WorkerDashboard({ worker, requests }: { worker: Worker; requests: Request[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("PENDING")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = requests.filter(r => r.status === activeTab)
  const pendingCount = requests.filter(r => r.status === "PENDING").length

  const updateStatus = async (requestId: string, status: string) => {
    setLoadingId(requestId)
    await fetch(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setLoadingId(null)
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex gap-3">
  <Button variant="outline" asChild>
    <Link href="/profile/edit">Editar perfil</Link>
  </Button>
  <Button variant="outline" asChild>
    <Link href="/agenda">Mi agenda</Link>
  </Button>
</div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi panel</h1>
          <p className="text-slate-500 mt-1">
            {worker.categories.map(c => `${c.icon ?? ""} ${c.name}`).join(", ")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">★ {worker.ratingAvg.toFixed(1)}</div>
          <div className="text-sm text-slate-400">{worker.totalReviews} reseñas</div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {TABS.map(tab => (
          <Card key={tab.key} className={`cursor-pointer transition-shadow hover:shadow-md ${activeTab === tab.key ? "ring-2 ring-slate-900" : ""}`}
            onClick={() => setActiveTab(tab.key)}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {requests.filter(r => r.status === tab.key).length}
              </div>
              <div className="text-xs text-slate-500 mt-1">{tab.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No hay solicitudes {TABS.find(t => t.key === activeTab)?.label.toLowerCase()}</p>
          </div>
        ) : (
          filtered.map(request => (
            <Card key={request.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[request.status]?.color}`}>
                        {STATUS_CONFIG[request.status]?.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(request.requestedDate).toLocaleDateString("es-AR", {
                          weekday: "long", day: "numeric", month: "long"
                        })} · {request.requestedTimeSlot}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-3 line-clamp-2">{request.description}</p>

                    <div className="text-sm text-slate-500">
                      <span className="font-medium text-slate-700">{request.client.fullName}</span>
                      {request.client.phone && (
                        <span className="ml-2">· {request.client.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {request.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={loadingId === request.id}
                          onClick={() => updateStatus(request.id, "ACCEPTED")}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingId === request.id}
                          onClick={() => updateStatus(request.id, "REJECTED")}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {(request.status === "ACCEPTED" || request.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === request.id}
                        onClick={() => updateStatus(request.id, "COMPLETED")}
                      >
                        Marcar completado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Props {
  params: { workerId: string }
}

export default async function WorkerProfilePage({ params }: { params: Promise<{ workerId: string }> }) {
  const { workerId } = await params
  const session = await getServerSession(authOptions)

  const worker = await prisma.workerProfile.findUnique({
  where: { id: workerId },
  include: {
    user: { select: { fullName: true, avatarUrl: true, email: true, id: true } },
    categories: true,
    availability: { orderBy: { dayOfWeek: "asc" } },
  },
})

if (!worker || !worker.isActive) notFound()

const reviews = await prisma.review.findMany({
  where: { revieweeId: worker.user.id },
  include: {
    reviewer: { select: { fullName: true } },
  },
  orderBy: { createdAt: "desc" },
  take: 10,
})

  const initials = worker.user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header del perfil */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-2xl shrink-0">
              {worker.user.avatarUrl ? (
                <img src={worker.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
              ) : initials}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{worker.user.fullName}</h1>
                {worker.isVerified && (
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Verificado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="font-semibold text-slate-700">{worker.ratingAvg.toFixed(1)}</span>
                <span className="text-slate-400 text-sm">({worker.totalReviews} reseñas)</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {worker.categories.map((cat: { id: string; name: string; icon: string | null }) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.icon} {cat.name}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-slate-400 mt-2">
                📍 {worker.coverageZones.join(", ")}
              </p>
            </div>
          </div>

          {worker.bio && (
            <p className="mt-4 text-slate-600 leading-relaxed">{worker.bio}</p>
          )}
        </CardContent>
      </Card>

      {/* Disponibilidad */}
      {worker.availability.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Disponibilidad</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {worker.availability.map((slot: { id: string; dayOfWeek: number; startTime: string; endTime: string }) => (
                <div key={slot.id} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="font-medium w-8">{DAYS[slot.dayOfWeek]}</span>
                  <span className="text-slate-400">{slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
{reviews.length > 0 && (
  <Card className="mb-6">
    <CardContent className="p-6">
      <h2 className="font-semibold text-slate-900 mb-4">
        Reseñas ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-slate-700">
                {review.reviewer.fullName}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <span key={i} className="text-slate-200 text-sm">★</span>
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString("es-AR", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

      {/* CTA */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-900 mb-2">¿Necesitás contratar a {worker.user.fullName.split(" ")[0]}?</h2>
          <p className="text-slate-500 text-sm mb-4">
            Enviá una solicitud con la fecha y el detalle del trabajo.
          </p>
          {session ? (
            session.user.role === "CLIENT" ? (
              <Button asChild>
                <Link href={`/requests/new?workerId=${worker.id}`}>
                  Solicitar servicio
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-slate-400">Los trabajadores no pueden enviar solicitudes.</p>
            )
          ) : (
            <div className="flex gap-3">
              <Button asChild>
                <Link href={`/login?callbackUrl=/profile/${worker.id}`}>
                  Iniciá sesión para solicitar
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

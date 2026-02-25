import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export default async function WorkerProfilePage({
  params,
}: {
  params: Promise<{ workerId: string }>
}) {
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
    include: { reviewer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const initials = worker.user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isClient = session?.user?.role === "CLIENT"
  const isOwner = session?.user?.id === worker.user.id

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── HERO ── */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-700" />

        <div className="px-6 pb-6">
          {/* Avatar sobre el banner */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-200 border-4 border-white flex items-center justify-center text-slate-600 font-bold text-2xl overflow-hidden shadow-md">
              {worker.user.avatarUrl ? (
                <img
                  src={worker.user.avatarUrl}
                  className="w-full h-full object-cover"
                  alt={worker.user.fullName}
                />
              ) : initials}
            </div>

            {/* CTA principal — visible desde arriba */}
            {isClient && (
              <Link
                href={`/requests/new?workerId=${worker.id}`}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Solicitar servicio →
              </Link>
            )}
            {!session && (
              <Link
                href={`/login?callbackUrl=/profile/${worker.id}`}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Iniciar sesión para contratar
              </Link>
            )}
            {isOwner && (
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-slate-400 font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Editar perfil
              </Link>
            )}
          </div>

          {/* Info principal */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">
                  {worker.user.fullName}
                </h1>
                {worker.isVerified && (
                  <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    ✓ Verificado
                  </span>
                )}
              </div>

              <p className="text-slate-500 mt-0.5">
                {worker.categories.map((c) => c.name).join(" · ")}
              </p>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
                  <span className="text-amber-400">★</span>
                  <span className="font-bold text-amber-700">{worker.ratingAvg.toFixed(1)}</span>
                  <span className="text-amber-600 text-sm">({worker.totalReviews} reseñas)</span>
                </div>

                {/* Zonas */}
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <span>📍</span>
                  <span>
                    {worker.coverageZones.slice(0, 3).join(", ")}
                    {worker.coverageZones.length > 3 && ` +${worker.coverageZones.length - 3} más`}
                  </span>
                </div>
              </div>
            </div>

            {/* Categorías como pills */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {worker.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="flex items-center gap-1.5 text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                >
                  {cat.icon} {cat.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {worker.bio && (
            <p className="mt-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {worker.bio}
            </p>
          )}
        </div>
      </div>

      {/* ── LAYOUT DOS COLUMNAS ── */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Columna izquierda — info secundaria */}
        <div className="space-y-6">

          {/* Disponibilidad */}
          {worker.availability.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📅</span>
                Disponibilidad
              </h2>
              <div className="space-y-2">
                {worker.availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-slate-700 w-10">
                      {DAYS[slot.dayOfWeek]}
                    </span>
                    <span className="text-slate-400">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zonas completas */}
          {worker.coverageZones.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📍</span>
                Zonas de trabajo
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {worker.coverageZones.map((zone) => (
                  <span
                    key={zone}
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA móvil / segunda instancia */}
          {!isClient && !session && (
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <p className="font-semibold mb-1">¿Necesitás este servicio?</p>
              <p className="text-sm text-slate-400 mb-4">
                Registrate gratis y agendá en minutos.
              </p>
              <Link
                href="/register"
                className="block text-center bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>
          )}
        </div>

        {/* Columna derecha — reviews */}
        <div className="md:col-span-2">
          {reviews.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-sm">★</span>
                Reseñas
                <span className="text-slate-400 font-normal text-sm ml-1">
                  ({reviews.length})
                </span>
              </h2>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-slate-100 last:border-0 pb-5 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {review.reviewer.fullName[0]}
                        </div>
                        <span className="font-medium text-sm text-slate-900">
                          {review.reviewer.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < review.rating ? "text-amber-400" : "text-slate-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-600 leading-relaxed pl-10">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5 pl-10">
                      {new Date(review.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                ⭐
              </div>
              <p className="font-medium text-slate-900">Sin reseñas todavía</p>
              <p className="text-sm text-slate-400 mt-1">
                Sé el primero en contratar y calificar a {worker.user.fullName.split(" ")[0]}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
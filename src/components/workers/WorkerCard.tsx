// src/components/workers/WorkerCard.tsx
import Link from "next/link"

interface WorkerCardProps {
  worker: {
    id: string
    ratingAvg: number
    totalReviews: number
    bio: string | null
    coverageZones: string[]
    isVerified: boolean
    user: { fullName: string; avatarUrl: string | null }
    categories: { id: string; name: string; icon: string | null; slug: string }[]
  }
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const initials = worker.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const mainCategory = worker.categories[0]

  return (
    <Link
      href={`/profile/${worker.id}`}
      className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-400 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg overflow-hidden">
            {worker.user.avatarUrl ? (
              <img
                src={worker.user.avatarUrl}
                className="w-full h-full object-cover"
                alt={worker.user.fullName}
              />
            ) : (
              initials
            )}
          </div>
          {mainCategory?.icon && (
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs shadow-sm">
              {mainCategory.icon}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Nombre + verificado */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
              {worker.user.fullName}
            </h3>
            {worker.isVerified && (
              <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                ✓ Verificado
              </span>
            )}
          </div>

          {/* Categorías */}
          <p className="text-sm text-slate-500 mt-0.5">
            {worker.categories.map((c) => c.name).join(" · ")}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-sm font-bold text-amber-700">
                {worker.ratingAvg.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {worker.totalReviews} reseña{worker.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {worker.bio && (
        <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed">
          {worker.bio}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
          <span>📍</span>
          <span className="truncate">
            {worker.coverageZones.slice(0, 2).join(", ")}
            {worker.coverageZones.length > 2 && ` +${worker.coverageZones.length - 2} más`}
          </span>
        </p>
        <span className="text-xs font-semibold text-slate-900 group-hover:text-orange-500 transition-colors shrink-0 ml-2">
          Ver perfil →
        </span>
      </div>
    </Link>
  )
}
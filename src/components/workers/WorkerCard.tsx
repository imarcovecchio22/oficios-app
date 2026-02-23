import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-lg shrink-0">
            {worker.user.avatarUrl ? (
              <img src={worker.user.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
            ) : initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900">{worker.user.fullName}</h3>
              {worker.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  ✓ Verificado
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-slate-700">{worker.ratingAvg.toFixed(1)}</span>
              <span className="text-sm text-slate-400">({worker.totalReviews} reseñas)</span>
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-1 mt-2">
              {worker.categories.map(cat => (
                <Badge key={cat.id} variant="secondary" className="text-xs">
                  {cat.icon} {cat.name}
                </Badge>
              ))}
            </div>

            {/* Bio */}
            {worker.bio && (
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{worker.bio}</p>
            )}

            {/* Zonas */}
            <p className="text-xs text-slate-400 mt-2">
              📍 {worker.coverageZones.slice(0, 3).join(", ")}
              {worker.coverageZones.length > 3 && ` +${worker.coverageZones.length - 3} más`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" asChild>
            <Link href={`/profile/${worker.id}`}>Ver perfil</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

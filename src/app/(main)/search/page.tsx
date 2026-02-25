// src/app/(main)/search/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import WorkerCard from "@/components/workers/WorkerCard"

const CATEGORIES = [
  { slug: "electricista", name: "Electricista", icon: "⚡" },
  { slug: "plomero", name: "Plomero", icon: "🔧" },
  { slug: "gasista", name: "Gasista", icon: "🔥" },
  { slug: "pintor", name: "Pintor", icon: "🎨" },
  { slug: "carpintero", name: "Carpintero", icon: "🪚" },
  { slug: "cerrajero", name: "Cerrajero", icon: "🔑" },
  { slug: "albanil", name: "Albañil", icon: "🧱" },
  { slug: "aire-acondicionado", name: "Aire acond.", icon: "❄️" },
]

type Worker = {
  id: string
  ratingAvg: number
  totalReviews: number
  bio: string | null
  coverageZones: string[]
  isVerified: boolean
  user: { fullName: string; avatarUrl: string | null }
  categories: { id: string; name: string; icon: string | null; slug: string }[]
}

function WorkerCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-32" />
          <div className="h-3 bg-slate-100 rounded w-24" />
          <div className="h-6 bg-slate-100 rounded w-16" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <div className="h-3 bg-slate-100 rounded w-28" />
        <div className="h-3 bg-slate-100 rounded w-16" />
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [zone, setZone] = useState("")
  const [zoneInput, setZoneInput] = useState("")

  const fetchWorkers = useCallback(async (category?: string | null, z?: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (z) params.set("zone", z)
    const res = await fetch(`/api/workers?${params}`)
    const data = await res.json()
    setWorkers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchWorkers(selectedCategory, zone)
  }, [selectedCategory, zone, fetchWorkers])

  const handleZoneSearch = () => setZone(zoneInput.trim())

  const clearFilters = () => {
    setSelectedCategory(null)
    setZone("")
    setZoneInput("")
  }

  const hasFilters = selectedCategory || zone

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Encontrá un profesional
        </h1>
        <p className="text-slate-500 mt-1">
          Profesionales verificados, con agenda real y reseñas comprobadas.
        </p>
      </div>

      {/* Buscador de zona */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📍</span>
          <input
            type="text"
            placeholder="Barrio o zona..."
            value={zoneInput}
            onChange={(e) => setZoneInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleZoneSearch()}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={handleZoneSearch}
          className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
        >
          Buscar
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)
            }
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedCategory === cat.slug
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => <WorkerCardSkeleton key={i} />)}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">
            No encontramos profesionales
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Probá con otra categoría o zona
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
          >
            Ver todos los profesionales
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{workers.length}</span>{" "}
              profesional{workers.length !== 1 ? "es" : ""} encontrado{workers.length !== 1 ? "s" : ""}
              {selectedCategory && (
                <span className="ml-1 text-slate-400">
                  · {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                </span>
              )}
              {zone && <span className="ml-1 text-slate-400">· {zone}</span>}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
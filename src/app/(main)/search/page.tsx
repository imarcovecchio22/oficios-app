"use client"

import { useState, useEffect } from "react"
import WorkerCard from "@/components/workers/WorkerCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
  { slug: "electricista", name: "Electricista", icon: "⚡" },
  { slug: "plomero", name: "Plomero", icon: "🔧" },
  { slug: "gasista", name: "Gasista", icon: "🔥" },
  { slug: "pintor", name: "Pintor", icon: "🎨" },
  { slug: "carpintero", name: "Carpintero", icon: "🪚" },
  { slug: "cerrajero", name: "Cerrajero", icon: "🔑" },
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

export default function SearchPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [zone, setZone] = useState("")
  const [zoneInput, setZoneInput] = useState("")

  const fetchWorkers = async (category?: string | null, z?: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (z) params.set("zone", z)

    const res = await fetch(`/api/workers?${params}`)
    const data = await res.json()
    setWorkers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchWorkers(selectedCategory, zone)
  }, [selectedCategory, zone])

  const handleZoneSearch = () => {
    setZone(zoneInput.trim())
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setZone("")
    setZoneInput("")
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Encontrá un profesional</h1>
        <p className="text-slate-500 mt-1">Electricistas, plomeros, gasistas y más</p>
      </div>

      {/* Filtro por zona */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Buscar por barrio o zona..."
          value={zoneInput}
          onChange={e => setZoneInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleZoneSearch()}
          className="max-w-sm"
        />
        <Button onClick={handleZoneSearch} variant="outline">Buscar</Button>
        {(selectedCategory || zone) && (
          <Button onClick={clearFilters} variant="ghost">Limpiar filtros</Button>
        )}
      </div>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(
              selectedCategory === cat.slug ? null : cat.slug
            )}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat.slug
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No encontramos profesionales con esos filtros</p>
          <p className="text-sm mt-1">Probá con otra categoría o zona</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {workers.length} profesional{workers.length !== 1 ? "es" : ""} encontrado{workers.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// src/components/workers/ProfileEditForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  icon: string | null
}

interface Props {
  worker: {
    id: string
    bio: string
    coverageZones: string[]
    categoryIds: string[]
  }
  allCategories: Category[]
}

export default function ProfileEditForm({ worker, allCategories }: Props) {
  const router = useRouter()
  const [bio, setBio] = useState(worker.bio)
  const [zones, setZones] = useState(worker.coverageZones.join(", "))
  const [selectedCategories, setSelectedCategories] = useState<string[]>(worker.categoryIds)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const coverageZones = zones
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean)

    await fetch(`/api/workers/${worker.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, coverageZones, categoryIds: selectedCategories }),
    })

    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Bio */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <Label htmlFor="bio" className="text-base font-semibold">
            Sobre vos
          </Label>
          <Textarea
            id="bio"
            placeholder="Contale a los clientes quién sos, tu experiencia y especialidades..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 text-right">{bio.length}/500</p>
        </CardContent>
      </Card>

      {/* Categorías */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <Label className="text-base font-semibold">¿Qué servicios ofrecés?</Label>
          <p className="text-sm text-slate-500">Podés seleccionar más de uno.</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedCategories.includes(cat.id)
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zonas */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <Label htmlFor="zones" className="text-base font-semibold">
            Zonas donde trabajás
          </Label>
          <p className="text-sm text-slate-500">
            Escribí los barrios o zonas separados por coma.
          </p>
          <Input
            id="zones"
            placeholder="Ej: Palermo, Belgrano, Villa Urquiza"
            value={zones}
            onChange={(e) => setZones(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Guardar */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            ✓ Cambios guardados
          </span>
        )}
      </div>
    </div>
  )
}

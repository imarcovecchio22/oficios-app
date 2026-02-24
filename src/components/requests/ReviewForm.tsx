	// src/components/requests/ReviewForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  requestId: string
  workerName: string
}

export default function ReviewForm({ requestId, workerName }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Seleccioná una calificación")
      return
    }
    setSubmitting(true)
    setError("")

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, rating, comment }),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? "Error al enviar la calificación")
      setSubmitting(false)
      return
    }

    router.push("/requests?reviewed=true")
    router.refresh()
  }

  const LABELS = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"]
  const activeRating = hovered || rating

  return (
    <Card>
      <CardContent className="p-6 space-y-6">

        {/* Estrellas */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">¿Cómo calificás el trabajo?</Label>
          <div className="flex items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <span className={`text-4xl ${star <= activeRating ? "text-yellow-400" : "text-slate-200"}`}>
                  ★
                </span>
              </button>
            ))}
            {activeRating > 0 && (
              <span className="text-sm font-medium text-slate-600 ml-2">
                {LABELS[activeRating]}
              </span>
            )}
          </div>
        </div>

        {/* Comentario */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-base font-semibold">
            Comentario <span className="text-slate-400 font-normal">(opcional)</span>
          </Label>
          <Textarea
            id="comment"
            placeholder={`Contale a otros usuarios cómo fue tu experiencia con ${workerName}...`}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 text-right">{comment.length}/500</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          size="lg"
          className="w-full"
        >
          {submitting ? "Enviando..." : "Publicar calificación"}
        </Button>
      </CardContent>
    </Card>
  )
}

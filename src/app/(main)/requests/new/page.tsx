"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const requestSchema = z.object({
  description: z.string().min(10, "Describí el trabajo con al menos 10 caracteres"),
  requestedDate: z.string().min(1, "Seleccioná una fecha"),
  requestedTimeSlot: z.string().min(1, "Seleccioná un horario"),
})

type RequestInput = z.infer<typeof requestSchema>

const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
]

export default function NewRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerId = searchParams.get("workerId")

  const [worker, setWorker] = useState<{ user: { fullName: string } } | null>(null)
  const [serverError, setServerError] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
  })

  useEffect(() => {
    if (!workerId) return
    fetch(`/api/workers/${workerId}`)
      .then(r => r.json())
      .then(setWorker)
  }, [workerId])

  const onSubmit = async (data: RequestInput) => {
    setServerError("")
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, workerId }),
    })

    if (!res.ok) {
      const json = await res.json()
      setServerError(json.error ?? "Error al enviar la solicitud")
      return
    }

    const { id } = await res.json()
    router.push(`/requests/${id}?sent=true`)
  }

  // Fecha mínima: mañana
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  if (!workerId) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Trabajador no especificado.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Solicitar servicio</CardTitle>
          {worker && (
            <CardDescription>
              Enviando solicitud a <strong>{worker.user.fullName}</strong>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Fecha */}
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                min={minDate}
                {...register("requestedDate")}
              />
              {errors.requestedDate && (
                <p className="text-sm text-red-500">{errors.requestedDate.message}</p>
              )}
            </div>

            {/* Horario */}
            <div className="space-y-2">
              <Label>Horario preferido</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot)
                      setValue("requestedTimeSlot", slot)
                    }}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSlot === slot
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.requestedTimeSlot && (
                <p className="text-sm text-red-500">{errors.requestedTimeSlot.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label>Descripción del trabajo</Label>
              <Textarea
                placeholder="Describí qué necesitás que haga el profesional. Cuanto más detalle, mejor."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

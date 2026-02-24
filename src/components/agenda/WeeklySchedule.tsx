// src/components/agenda/WeeklySchedule.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const DAYS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 0 },
]

const TIME_OPTIONS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00",
]

interface Slot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface Props {
  initialSlots: Slot[]
}

export default function WeeklySchedule({ initialSlots }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const getDaySlot = (day: number) => slots.find((s) => s.dayOfWeek === day)
  const isDayActive = (day: number) => !!getDaySlot(day)

  const toggleDay = (day: number) => {
    if (isDayActive(day)) {
      setSlots((prev) => prev.filter((s) => s.dayOfWeek !== day))
    } else {
      setSlots((prev) => [
        ...prev,
        { dayOfWeek: day, startTime: "09:00", endTime: "18:00" },
      ])
    }
  }

  const updateSlot = (day: number, field: "startTime" | "endTime", value: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    })
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {DAYS.map((day) => {
          const active = isDayActive(day.value)
          const slot = getDaySlot(day.value)

          return (
            <Card key={day.value} className={active ? "border-slate-900" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Toggle día */}
                  <button
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                      active ? "bg-slate-900" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        active ? "left-5" : "left-1"
                      }`}
                    />
                  </button>

                  {/* Nombre del día */}
                  <span
                    className={`w-24 font-medium text-sm ${
                      active ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {day.label}
                  </span>

                  {/* Horarios */}
                  {active && slot ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-500 shrink-0">Desde</Label>
                        <select
                          value={slot.startTime}
                          onChange={(e) => updateSlot(day.value, "startTime", e.target.value)}
                          className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-slate-500 shrink-0">Hasta</Label>
                        <select
                          value={slot.endTime}
                          onChange={(e) => updateSlot(day.value, "endTime", e.target.value)}
                          className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700"
                        >
                          {TIME_OPTIONS.filter((t) => t > slot.startTime).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">No disponible</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Guardando..." : "Guardar agenda"}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Agenda guardada</span>
        )}
      </div>
    </div>
  )
}

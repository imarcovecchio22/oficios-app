// src/app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState("")

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CLIENT" },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: RegisterInput) => {
    setServerError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      const firstError = Object.values(json.error)?.[0] as string[]
      setServerError(firstError?.[0] ?? "Error al registrarse")
      return
    }

    router.push("/login?registered=true")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Creá tu cuenta</CardTitle>
          <CardDescription>Unite a OficiosApp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Selector de rol */}
            <div className="grid grid-cols-2 gap-3">
              {(["CLIENT", "WORKER"] as const).map((role) => (
                <label
                  key={role}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedRole === role
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input type="radio" value={role} className="sr-only" {...register("role")} />
                  <span className="text-2xl mb-1">{role === "CLIENT" ? "🔧" : "👷"}</span>
                  <span className="text-sm font-medium">
                    {role === "CLIENT" ? "Necesito servicios" : "Soy trabajador"}
                  </span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" placeholder="Juan Pérez" {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input id="phone" type="tel" placeholder="+54 11 1234-5678" {...register("phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-slate-900 font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { fullName, email, password, phone, role } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: { email: ["Este email ya está registrado"] } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone,
        role,
        // Si es trabajador, crear el perfil vacío automáticamente
        ...(role === "WORKER" && {
          workerProfile: {
            create: {
              bio: "",
              coverageZones: [],
            },
          },
        }),
      },
    })

    return NextResponse.json(
      { message: "Usuario creado", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER_ERROR]", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

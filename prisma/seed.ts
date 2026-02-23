import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Categorías
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "electricista" }, update: {}, create: { name: "Electricista", slug: "electricista", icon: "⚡" } }),
    prisma.category.upsert({ where: { slug: "plomero" }, update: {}, create: { name: "Plomero", slug: "plomero", icon: "🔧" } }),
    prisma.category.upsert({ where: { slug: "gasista" }, update: {}, create: { name: "Gasista", slug: "gasista", icon: "🔥" } }),
    prisma.category.upsert({ where: { slug: "pintor" }, update: {}, create: { name: "Pintor", slug: "pintor", icon: "🎨" } }),
    prisma.category.upsert({ where: { slug: "carpintero" }, update: {}, create: { name: "Carpintero", slug: "carpintero", icon: "🪚" } }),
    prisma.category.upsert({ where: { slug: "cerrajero" }, update: {}, create: { name: "Cerrajero", slug: "cerrajero", icon: "🔑" } }),
  ])

  // Trabajadores de prueba
  const workers = [
    { name: "Carlos Méndez", email: "carlos@test.com", bio: "Electricista matriculado con 10 años de experiencia en instalaciones residenciales y comerciales.", zones: ["Palermo", "Belgrano", "Recoleta"], rating: 4.8, reviews: 24, categorySlug: "electricista" },
    { name: "Roberto Silva", email: "roberto@test.com", bio: "Plomero con especialización en destapaciones y reparaciones de cañerías.", zones: ["Almagro", "Caballito", "Flores"], rating: 4.5, reviews: 18, categorySlug: "plomero" },
    { name: "Diego Torres", email: "diego@test.com", bio: "Gasista matriculado. Instalación y reparación de artefactos a gas.", zones: ["Palermo", "Villa Crespo", "Colegiales"], rating: 4.9, reviews: 31, categorySlug: "gasista" },
    { name: "Martín López", email: "martin@test.com", bio: "Pintor profesional, interiores y exteriores. Presupuesto sin cargo.", zones: ["San Telmo", "La Boca", "Barracas"], rating: 4.3, reviews: 12, categorySlug: "pintor" },
    { name: "Pablo Fernández", email: "pablo@test.com", bio: "Electricista y técnico en aire acondicionado. Urgencias 24hs.", zones: ["Belgrano", "Núñez", "Saavedra"], rating: 4.7, reviews: 29, categorySlug: "electricista" },
  ]

  for (const w of workers) {
    const hash = await bcrypt.hash("password123", 12)
    const category = categories.find(c => c.slug === w.categorySlug)!

    const user = await prisma.user.upsert({
      where: { email: w.email },
      update: {},
      create: {
        fullName: w.name,
        email: w.email,
        passwordHash: hash,
        role: "WORKER",
        workerProfile: {
          create: {
            bio: w.bio,
            coverageZones: w.zones,
            isVerified: true,
            isActive: true,
            ratingAvg: w.rating,
            totalReviews: w.reviews,
            categories: { connect: { id: category.id } },
          },
        },
      },
    })
    console.log(`✓ Worker creado: ${w.name}`)
  }

  console.log("✅ Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

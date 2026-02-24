// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
})

async function main() {
  // ── Categorías ──
  const categories = [
    { name: "Electricista", slug: "electricista", icon: "⚡" },
    { name: "Plomero", slug: "plomero", icon: "🔧" },
    { name: "Gasista", slug: "gasista", icon: "🔥" },
    { name: "Carpintero", slug: "carpintero", icon: "🪟" },
    { name: "Pintor", slug: "pintor", icon: "🎨" },
    { name: "Cerrajero", slug: "cerrajero", icon: "🔐" },
    { name: "Albañil", slug: "albanil", icon: "🧱" },
    { name: "Aire acondicionado", slug: "aire-acondicionado", icon: "❄️" },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories[cat.slug] = created.id
  }
  console.log("✅ Categorías creadas")

  // ── Workers de prueba ──
  const workers = [
    {
      fullName: "Carlos Méndez",
      email: "carlos.mendez@test.com",
      phone: "+54 11 4523-8891",
      bio: "Electricista matriculado con más de 15 años de experiencia en instalaciones residenciales y comerciales. Especializado en tableros eléctricos, iluminación LED y sistemas de alarma.",
      categories: ["electricista"],
      coverageZones: ["Palermo", "Belgrano", "Núñez", "Colegiales"],
      ratingAvg: 4.9,
      totalReviews: 87,
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" },
      ],
    },
    {
      fullName: "Roberto Sánchez",
      email: "roberto.sanchez@test.com",
      phone: "+54 11 6234-7712",
      bio: "Plomero con 10 años en el oficio. Atiendo urgencias de cañerías, destapes, instalación de calefones y reparación de pérdidas. Trabajo garantizado.",
      categories: ["plomero"],
      coverageZones: ["Caballito", "Flores", "Villa Crespo", "Almagro"],
      ratingAvg: 4.7,
      totalReviews: 63,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "19:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "19:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "19:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "19:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" },
      ],
    },
    {
      fullName: "Alejandro Torres",
      email: "alejandro.torres@test.com",
      phone: "+54 11 5567-3341",
      bio: "Gasista matriculado (Mat. 12.445). Instalaciones de gas natural y envasado, service de calefones, estufas y cocinas. Habilitaciones municipales.",
      categories: ["gasista"],
      coverageZones: ["San Telmo", "La Boca", "Barracas", "Boedo"],
      ratingAvg: 4.8,
      totalReviews: 41,
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" },
      ],
    },
    {
      fullName: "Martín Rodríguez",
      email: "martin.rodriguez@test.com",
      phone: "+54 11 4891-2256",
      bio: "Electricista y técnico en climatización. Instalo splits, centrales y equipos de aire acondicionado de todas las marcas. Garantía en materiales y mano de obra.",
      categories: ["electricista", "aire-acondicionado"],
      coverageZones: ["Recoleta", "Retiro", "San Nicolás", "Montserrat"],
      ratingAvg: 4.6,
      totalReviews: 29,
      availability: [
        { dayOfWeek: 1, startTime: "10:00", endTime: "19:00" },
        { dayOfWeek: 2, startTime: "10:00", endTime: "19:00" },
        { dayOfWeek: 3, startTime: "10:00", endTime: "19:00" },
        { dayOfWeek: 5, startTime: "10:00", endTime: "19:00" },
        { dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
      ],
    },
    {
      fullName: "Diego Fernández",
      email: "diego.fernandez@test.com",
      phone: "+54 11 3345-8890",
      bio: "Pintor profesional con experiencia en pintura interior y exterior, enduído, texturado y revestimientos. Presupuesto sin cargo. Trabajo prolijo y en tiempo.",
      categories: ["pintor"],
      coverageZones: ["Palermo", "Villa Urquiza", "Saavedra", "Devoto"],
      ratingAvg: 4.5,
      totalReviews: 54,
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" },
      ],
    },
    {
      fullName: "Pablo Giménez",
      email: "pablo.gimenez@test.com",
      phone: "+54 11 6678-1123",
      bio: "Carpintero con especialización en muebles a medida, placares, cocinas y restauración de muebles antiguos. Trabajo en madera maciza y melamina.",
      categories: ["carpintero"],
      coverageZones: ["Ramos Mejía", "Haedo", "Morón", "Castelar"],
      ratingAvg: 4.8,
      totalReviews: 38,
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" },
      ],
    },
    {
      fullName: "Lucas Pereyra",
      email: "lucas.pereyra@test.com",
      phone: "+54 11 4412-6678",
      bio: "Cerrajero con servicio de urgencias 24hs. Apertura de puertas sin daño, cambio de cilindros, instalación de cerraduras de seguridad y cajas fuertes.",
      categories: ["cerrajero"],
      coverageZones: ["Palermo", "Belgrano", "Recoleta", "Almagro", "Caballito"],
      ratingAvg: 4.9,
      totalReviews: 112,
      availability: [
        { dayOfWeek: 0, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 1, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "22:00" },
        { dayOfWeek: 6, startTime: "08:00", endTime: "22:00" },
      ],
    },
    {
      fullName: "Sergio Romero",
      email: "sergio.romero@test.com",
      phone: "+54 11 5534-9987",
      bio: "Albañil con 20 años de experiencia. Construcción, refacciones, revoques, contrapisos, colocación de cerámicos y azulejos. Presupuesto gratis.",
      categories: ["albanil"],
      coverageZones: ["Lanús", "Avellaneda", "Quilmes", "Lomas de Zamora"],
      ratingAvg: 4.6,
      totalReviews: 45,
      availability: [
        { dayOfWeek: 1, startTime: "07:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "07:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "07:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "07:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "07:00", endTime: "17:00" },
        { dayOfWeek: 6, startTime: "07:00", endTime: "12:00" },
      ],
    },
  ]

  const passwordHash = await bcrypt.hash("test1234", 12)

  for (const w of workers) {
    // Upsert del usuario
    const user = await prisma.user.upsert({
      where: { email: w.email },
      update: {},
      create: {
        email: w.email,
        fullName: w.fullName,
        phone: w.phone,
        passwordHash,
        role: "WORKER",
      },
    })

    // Upsert del perfil
    const profile = await prisma.workerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: w.bio,
        coverageZones: w.coverageZones,
        isVerified: true,
        isActive: true,
        ratingAvg: w.ratingAvg,
        totalReviews: w.totalReviews,
        categories: {
          connect: w.categories.map((slug) => ({ id: createdCategories[slug] })),
        },
      },
    })

    // Disponibilidad — borrar y recrear
    await prisma.availabilitySlot.deleteMany({ where: { workerId: profile.id } })
    await prisma.availabilitySlot.createMany({
      data: w.availability.map((slot) => ({ ...slot, workerId: profile.id })),
    })

    console.log(`✅ Worker creado: ${w.fullName}`)
  }

  console.log("\n🎉 Seed completado — categorías + 8 workers de prueba")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
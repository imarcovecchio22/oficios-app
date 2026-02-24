// prisma/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
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

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log("✅ Categorías creadas")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
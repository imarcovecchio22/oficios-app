// src/app/(main)/profile/edit/page.tsx
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileEditForm from "@/components/workers/ProfileEditForm"

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "WORKER") redirect("/search")

  const worker = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
    include: { categories: true },
  })
  if (!worker) redirect("/login")

  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Editar perfil</h1>
        <p className="text-slate-500 mt-1">
          Esta información es lo primero que ven los clientes.
        </p>
      </div>
      <ProfileEditForm
        worker={{
          id: worker.id,
          bio: worker.bio ?? "",
          coverageZones: worker.coverageZones,
          categoryIds: worker.categories.map((c) => c.id),
        }}
        allCategories={allCategories}
      />
    </div>
  )
}

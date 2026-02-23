import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  // Por ahora redirigimos según rol
  if (session.user.role === "CLIENT") redirect("/search")

  // Worker dashboard — próximo paso
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-slate-900">Panel del trabajador</h1>
      <p className="text-slate-500 mt-2">Próximamente...</p>
    </div>
  )
}

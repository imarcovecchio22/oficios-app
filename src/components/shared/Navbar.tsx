import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-slate-900">
          OficiosApp
        </Link>

        <nav className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:block">
                {session.user.name}
              </span>

              {session.user.role === "WORKER" ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/agenda">Mi agenda</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">Mi panel</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/requests">Mis solicitudes</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/search">Buscar</Link>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/api/auth/signout">Salir</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
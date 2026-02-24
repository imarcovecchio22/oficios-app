import Link from "next/link"

const CATEGORIES = [
  { icon: "⚡", name: "Electricista", count: "240+ profesionales" },
  { icon: "🔧", name: "Plomero", count: "180+ profesionales" },
  { icon: "🔥", name: "Gasista", count: "120+ profesionales" },
  { icon: "🪟", name: "Carpintero", count: "95+ profesionales" },
  { icon: "🎨", name: "Pintor", count: "210+ profesionales" },
  { icon: "🔐", name: "Cerrajero", count: "88+ profesionales" },
]

const STEPS = [
  {
    number: "01",
    title: "Buscá el profesional",
    description: "Filtrá por oficio, zona y disponibilidad. Leé reseñas reales de trabajos anteriores.",
  },
  {
    number: "02",
    title: "Agendá el trabajo",
    description: "Elegí fecha y horario directamente en la agenda del profesional. Sin llamadas, sin esperas.",
  },
  {
    number: "03",
    title: "Confirmación garantizada",
    description: "El profesional confirma hasta 48hs antes. Si no confirma, te sugerimos una alternativa.",
  },
]

const TESTIMONIALS = [
  {
    name: "Martina G.",
    location: "Palermo, CABA",
    text: "Encontré un electricista matriculado en 10 minutos. Me mostró sus reseñas y agendé directo. Increíble.",
    rating: 5,
    service: "Electricista",
  },
  {
    name: "Carlos D.",
    location: "San Isidro, GBA",
    text: "Como plomero, me cambió la vida tener mi agenda organizada y los clientes me encuentran solos.",
    rating: 5,
    service: "Plomero",
  },
  {
    name: "Laura M.",
    location: "Caballito, CABA",
    text: "Antes llamaba a 4 personas y nadie contestaba. Acá en 5 minutos tenía 3 opciones disponibles.",
    rating: 5,
    service: "Gasista",
  },
]

const STATS = [
  { value: "12.000+", label: "Trabajos realizados" },
  { value: "4.8", label: "Calificación promedio" },
  { value: "850+", label: "Profesionales activos" },
  { value: "48hs", label: "Confirmación garantizada" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F0F0F]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-xl tracking-tight">OficiosApp</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[900px] h-[600px] rounded-full bg-[#F97316]/10 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 mb-8">
              <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
              850+ profesionales verificados en Argentina
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              El profesional
              <br />
              que necesitás,{" "}
              <span className="text-[#F97316]">cuando</span>
              <br />
              lo necesitás.
            </h1>

            <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-xl">
              Contratá electricistas, plomeros, gasistas y más con agenda real,
              reseñas verificadas y confirmación garantizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Buscar profesional
                <span className="text-xl">→</span>
              </Link>
              <Link
                href="/register?role=WORKER"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all"
              >
                Soy profesional
              </Link>
            </div>
          </div>

          {/* Hero visual — floating cards */}
          <div className="hidden lg:block absolute right-0 top-0 w-[420px]">
            <div className="relative">
              {/* Worker card 1 */}
              <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#F97316]/20 flex items-center justify-center text-xl">👷</div>
                  <div>
                    <p className="font-semibold">Martín Rodríguez</p>
                    <p className="text-sm text-white/50">Electricista matriculado · Palermo</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[#F97316]">★</span>
                    <span className="font-bold">4.9</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60">Disponible hoy</span>
                  <span className="text-xs bg-[#F97316]/10 border border-[#F97316]/20 px-3 py-1 rounded-full text-[#F97316]">142 trabajos</span>
                </div>
              </div>

              {/* Confirmation badge */}
              <div className="mt-3 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Trabajo confirmado</p>
                  <p className="text-xs text-white/50">Lunes 3 de marzo · 10:00 - 12:00</p>
                </div>
              </div>

              {/* Review badge */}
              <div className="mt-3 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-[#F97316] text-sm">★</span>)}
                </div>
                <p className="text-sm text-white/70">"Excelente trabajo, muy puntual y prolijo. Lo recomiendo."</p>
                <p className="text-xs text-white/30 mt-1">— Ana P., Belgrano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-white/10 bg-white/[0.02] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-[#F97316]">{stat.value}</p>
              <p className="text-sm text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Servicios</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              ¿Qué necesitás
              <br />
              resolver hoy?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/search?category=${cat.name.toLowerCase()}`}
                className="group bg-[#1A1A1A] hover:bg-[#222] border border-white/10 hover:border-[#F97316]/30 rounded-2xl p-6 transition-all hover:scale-[1.02]"
              >
                <span className="text-4xl block mb-3">{cat.icon}</span>
                <p className="font-bold text-lg">{cat.name}</p>
                <p className="text-sm text-white/40 mt-1">{cat.count}</p>
                <div className="mt-4 flex items-center gap-1 text-[#F97316] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver profesionales <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-xl">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Cómo funciona</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Simple, rápido
              <br />
              y sin sorpresas.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-7xl font-black text-white/5 leading-none mb-4 select-none">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Testimonios</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Lo que dicen
              <br />
              nuestros usuarios.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-[#F97316]">★</span>
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-white/40">{t.location}</p>
                  </div>
                  <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA WORKERS ─── */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#F97316]/20 to-[#F97316]/5 border border-[#F97316]/20 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl">
              <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-4">Para profesionales</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Conseguí más trabajo.
                <br />
                Gestioná tu agenda.
                <br />
                Construí tu reputación.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Creá tu perfil gratis, configurá tu disponibilidad y empezá a recibir
                solicitudes de clientes verificados en tu zona.
              </p>
              <Link
                href="/register?role=WORKER"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-[1.02]"
              >
                Crear mi perfil gratis
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[800px] h-[400px] bg-[#F97316]/8 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            ¿Qué estás
            <br />
            esperando?
          </h2>
          <p className="text-xl text-white/50 mb-10">
            Miles de profesionales verificados listos para ayudarte.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Buscar profesional ahora
            <span className="text-2xl">→</span>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-lg">OficiosApp</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/search" className="hover:text-white transition-colors">Buscar</Link>
            <Link href="/register" className="hover:text-white transition-colors">Registrarse</Link>
            <Link href="/login" className="hover:text-white transition-colors">Ingresar</Link>
          </div>
          <p className="text-sm text-white/30">© 2025 OficiosApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
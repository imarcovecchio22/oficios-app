// src/services/notification.service.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "onboarding@resend.dev"
const DEV_EMAIL = "imarcovecchio22@gmail.com" 
const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

// ── Email al worker cuando recibe una nueva solicitud ──
export async function sendNewRequestEmail({
  workerEmail,
  workerName,
  clientName,
  requestedDate,
  requestedTimeSlot,
  description,
  requestId,
}: {
  workerEmail: string
  workerName: string
  clientName: string
  requestedDate: Date
  requestedTimeSlot: string
  description: string
  requestId: string
}) {
  const dateStr = new Date(requestedDate).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(workerEmail),
    subject: `Nueva solicitud de servicio — ${clientName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a;margin-bottom:4px">Hola, ${workerName} 👋</h2>
        <p style="color:#64748b;margin-top:0">Recibiste una nueva solicitud de servicio.</p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:24px 0">
          <p style="margin:0 0 8px 0"><strong>Cliente:</strong> ${clientName}</p>
          <p style="margin:0 0 8px 0"><strong>Fecha:</strong> ${dateStr}</p>
          <p style="margin:0 0 8px 0"><strong>Horario:</strong> ${requestedTimeSlot}</p>
          <p style="margin:0"><strong>Descripción:</strong> ${description}</p>
        </div>

        <a href="${APP_URL}/dashboard"
          style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Ver solicitud en mi panel →
        </a>

        <p style="color:#94a3b8;font-size:12px;margin-top:32px">
          Tenés tiempo de responder antes de que expire la solicitud.<br/>
          OficiosApp · <a href="${APP_URL}" style="color:#94a3b8">${APP_URL}</a>
        </p>
      </div>
    `,
  })
}

// ── Email al cliente cuando el worker acepta ──
export async function sendRequestAcceptedEmail({
  clientEmail,
  clientName,
  workerName,
  workerPhone,
  requestedDate,
  requestedTimeSlot,
  requestId,
}: {
  clientEmail: string
  clientName: string
  workerName: string
  workerPhone?: string | null
  requestedDate: Date
  requestedTimeSlot: string
  requestId: string
}) {
  const dateStr = new Date(requestedDate).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(clientEmail),
    subject: `✅ Tu solicitud fue aceptada — ${workerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a;margin-bottom:4px">¡Buenas noticias, ${clientName}! 🎉</h2>
        <p style="color:#64748b;margin-top:0">${workerName} aceptó tu solicitud.</p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0">
          <p style="margin:0 0 8px 0"><strong>Profesional:</strong> ${workerName}</p>
          <p style="margin:0 0 8px 0"><strong>Fecha:</strong> ${dateStr}</p>
          <p style="margin:0 0 8px 0"><strong>Horario:</strong> ${requestedTimeSlot}</p>
          ${workerPhone ? `<p style="margin:0"><strong>Contacto:</strong> ${workerPhone}</p>` : ""}
        </div>

        <a href="${APP_URL}/requests/${requestId}"
          style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Ver detalle de la solicitud →
        </a>

        <p style="color:#94a3b8;font-size:12px;margin-top:32px">
          OficiosApp · <a href="${APP_URL}" style="color:#94a3b8">${APP_URL}</a>
        </p>
      </div>
    `,
  })
}

// ── Email al cliente cuando el worker rechaza ──
export async function sendRequestRejectedEmail({
  clientEmail,
  clientName,
  workerName,
}: {
  clientEmail: string
  clientName: string
  workerName: string
}) {
  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(clientEmail),
    subject: `Tu solicitud no pudo ser confirmada`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a;margin-bottom:4px">Hola, ${clientName}</h2>
        <p style="color:#64748b;margin-top:0">
          Lamentablemente, ${workerName} no puede atender tu solicitud en ese horario.
        </p>

        <p style="color:#475569">
          No te preocupes, hay otros profesionales disponibles. Podés buscar una alternativa
          y agendar con otro profesional.
        </p>

        <a href="${APP_URL}/search"
          style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Buscar otro profesional →
        </a>

        <p style="color:#94a3b8;font-size:12px;margin-top:32px">
          OficiosApp · <a href="${APP_URL}" style="color:#94a3b8">${APP_URL}</a>
        </p>
      </div>
    `,
  })
}

function resolveRecipient(email: string): string {
  return process.env.RESEND_VERIFIED_DOMAIN ? email : DEV_EMAIL
}

// ── Email al cliente pidiendo que califique ──
export async function sendReviewRequestEmail({
  clientEmail,
  clientName,
  workerName,
  requestId,
}: {
  clientEmail: string
  clientName: string
  workerName: string
  requestId: string
}) {
  await resend.emails.send({
    from: FROM,
    to: resolveRecipient(clientEmail),
    subject: `¿Cómo te fue con ${workerName}? Dejá tu calificación`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a;margin-bottom:4px">Hola, ${clientName} 👋</h2>
        <p style="color:#64748b;margin-top:0">
          ${workerName} marcó tu trabajo como completado. ¿Cómo fue la experiencia?
        </p>

        <p style="color:#475569">
          Tu calificación ayuda a otros usuarios a elegir profesionales de confianza.
          Solo te toma un minuto.
        </p>

        <a href="${APP_URL}/reviews/new?requestId=${requestId}"
          style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Calificar a ${workerName} ★
        </a>

        <p style="color:#94a3b8;font-size:12px;margin-top:32px">
          OficiosApp · <a href="${APP_URL}" style="color:#94a3b8">${APP_URL}</a>
        </p>
      </div>
    `,
  })
}

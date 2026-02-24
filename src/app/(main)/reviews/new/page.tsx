// src/app/(main)/reviews/new/page.tsx
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ReviewForm from "@/components/requests/ReviewForm"

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string }>
}) {
  const { requestId } = await searchParams
  if (!requestId) notFound()

  const session = await getServerSession(authOptions)
  if (!session) redirect(`/login?callbackUrl=/reviews/new?requestId=${requestId}`)

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      worker: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          categories: true,
        },
      },
      review: true,
    },
  })

  if (!request || request.clientId !== session.user.id) notFound()
  if (request.status !== "COMPLETED") redirect("/requests")
  if (request.review) redirect("/requests?alreadyReviewed=true")

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Calificá el servicio</h1>
        <p className="text-slate-500 mt-1">
          Tu opinión ayuda a otros usuarios a elegir mejor.
        </p>
      </div>

      {/* Info del trabajador */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl">
          {request.worker.categories[0]?.icon ?? "👷"}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{request.worker.user.fullName}</p>
          <p className="text-sm text-slate-500">
            {request.worker.categories[0]?.name} ·{" "}
            {new Date(request.requestedDate).toLocaleDateString("es-AR", {
              day: "numeric", month: "long"
            })}
          </p>
        </div>
      </div>

      <ReviewForm requestId={requestId} workerName={request.worker.user.fullName} />
    </div>
  )
}

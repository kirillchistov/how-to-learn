import Link from "next/link"
import { PageFrame } from "@/components/page-frame"

export default function NotFound() {
  return (
    <PageFrame>
      <h1 className="text-4xl font-semibold tracking-tight">Страница не найдена</h1>
      <p className="mt-4 leading-7 text-zinc-600">
        Такой записи нет среди опубликованных материалов.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline decoration-zinc-300 underline-offset-4">
          Ко всем материалам
        </Link>
      </p>
    </PageFrame>
  )
}

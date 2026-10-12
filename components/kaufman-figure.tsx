import Image from "next/image"

export function KaufmanFigure() {
  return (
    <figure className="my-8">
      <Image
        src="/images/kaufman-triangle.svg"
        alt="Синий треугольник как знак одного навыка"
        width={180}
        height={182}
        unoptimized
      />
      <figcaption className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
        Одна фигура — один навык. Пока цель одна, проще заметить, есть ли движение.
      </figcaption>
    </figure>
  )
}

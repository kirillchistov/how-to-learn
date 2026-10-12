import type { Metadata } from "next"
import { PageFrame } from "@/components/page-frame"
import { PostList } from "@/components/post-list"
import { getSignals } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Радар",
  description: "Свежие материалы о учёбе с коротким комментарием и ссылкой на источник.",
}

export default async function RadarPage() {
  const posts = await getSignals()

  return (
    <PageFrame>
      <h1 className="text-4xl font-semibold tracking-tight">Радар</h1>
      <p className="mt-4 leading-7 text-zinc-600">
        Заметки о материалах, которые быстро набирают внимание. Это не перепечатка: своя мысль,
        ссылка на оригинал и связь с одной техникой из канона. На сайт попадает то, что уже
        прочитано человеком.
      </p>
      <PostList
        posts={posts}
        empty="Пока нет опубликованных сигналов. Новая заметка сначала проходит чтение и только потом появляется здесь."
      />
    </PageFrame>
  )
}

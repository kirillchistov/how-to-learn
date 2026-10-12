import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame } from "@/components/page-frame"
import { PostList } from "@/components/post-list"
import { getPostsByTag } from "@/lib/posts"
import { TAGS, isTagId } from "@/lib/taxonomy"

export function generateStaticParams() {
  return Object.keys(TAGS).map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  if (!isTagId(tag)) return { title: "Рубрика не найдена" }
  return { title: TAGS[tag], description: `Материалы по рубрике «${TAGS[tag]}».` }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  if (!isTagId(tag)) notFound()

  const posts = await getPostsByTag(tag)

  return (
    <PageFrame>
      <h1 className="text-4xl font-semibold tracking-tight">{TAGS[tag]}</h1>
      <PostList posts={posts} />
    </PageFrame>
  )
}

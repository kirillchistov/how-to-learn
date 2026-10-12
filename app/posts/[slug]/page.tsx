import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageFrame } from "@/components/page-frame"
import { PostBody } from "@/components/post-body"
import { TagList } from "@/components/tag-list"
import { formatDate } from "@/lib/format"
import { getPost, getVisiblePosts } from "@/lib/posts"
import { KIND_LABEL } from "@/lib/taxonomy"

export async function generateStaticParams() {
  const posts = await getVisiblePosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Материал не найден" }
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const related = post.relatedSlug ? await getPost(post.relatedSlug) : null

  return (
    <PageFrame>
    <article>
      {post.status === "draft" ? (
        <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          Черновик. На опубликованном сайте эта запись скрыта, пока статус не сменят на published.
        </p>
      ) : null}
      <p className="text-sm text-zinc-500">
        {formatDate(post.date)} · {KIND_LABEL[post.kind]}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600">{post.description}</p>
      <TagList tags={post.tags} />
      {post.kind === "signal" ? (
        <p className="mt-6 border-l-2 border-zinc-300 pl-4 text-sm leading-6 text-zinc-600">
          Сигнал радара: комментарий к чужому материалу, не устоявшийся вывод.
          {post.sourceUrl ? (
            <>
              {" "}
              Источник:{" "}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-800"
              >
                {post.sourceTitle}
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}
      <PostBody source={post.body} />
      {related ? (
        <p className="mt-12 border-t border-zinc-200 pt-6 leading-7 text-zinc-700">
          Из канона:{" "}
          <Link
            href={`/posts/${related.slug}`}
            className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-800"
          >
            {related.title}
          </Link>
        </p>
      ) : null}
    </article>
    </PageFrame>
  )
}

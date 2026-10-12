import Link from "next/link"
import { formatDate } from "@/lib/format"
import { KIND_LABEL } from "@/lib/taxonomy"
import type { Post } from "@/lib/types"
import { TagList } from "@/components/tag-list"

export function PostList({
  posts,
  empty = "В этой рубрике пока ничего нет.",
}: {
  posts: Post[]
  empty?: string
}) {
  if (posts.length === 0) {
    return <p className="mt-10 leading-7 text-zinc-600">{empty}</p>
  }

  return (
    <div className="mt-10 divide-y divide-zinc-200 border-t border-zinc-200">
      {posts.map((post) => (
        <article key={post.slug} className="py-8">
          <p className="text-sm text-zinc-500">
            {post.status === "draft" ? "Черновик · " : null}
            {formatDate(post.date)} · {KIND_LABEL[post.kind]}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            <Link href={`/posts/${post.slug}`} className="hover:underline hover:decoration-zinc-300">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 leading-7 text-zinc-600">{post.description}</p>
          <TagList tags={post.tags} />
        </article>
      ))}
    </div>
  )
}

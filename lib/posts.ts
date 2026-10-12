import { cacheLife } from "next/cache"
import { readAllPosts, visiblePosts } from "@/lib/post-file"
import type { TagId } from "@/lib/taxonomy"
import type { Post } from "@/lib/types"

const includeDrafts =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

async function readVisiblePosts(showDrafts: boolean): Promise<Post[]> {
  "use cache"
  cacheLife("days")

  const posts = await readAllPosts()
  return visiblePosts(posts, showDrafts)
}

export function getVisiblePosts() {
  return readVisiblePosts(includeDrafts)
}

export async function getPost(slug: string) {
  const posts = await getVisiblePosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function getPostsByTag(tag: TagId) {
  const posts = await getVisiblePosts()
  return posts.filter((post) => post.tags.includes(tag))
}

export async function getSignals() {
  const posts = await getVisiblePosts()
  return posts.filter((post) => post.kind === "signal")
}

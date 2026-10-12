import type { TagId } from "@/lib/taxonomy"

export type PostKind = "canon" | "signal"
export type PostStatus = "draft" | "published"

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags: TagId[]
  status: PostStatus
  kind: PostKind
  sourceUrl?: string
  sourceTitle?: string
  relatedSlug?: string
  body: string
}

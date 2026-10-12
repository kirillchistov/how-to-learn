import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { isTagId, type TagId } from "@/lib/taxonomy"
import type { Post } from "@/lib/types"

const CONTENT_DIR = path.join(process.cwd(), "content")
const FOLDERS = ["canon", "radar"] as const

export async function readAllPosts(): Promise<Post[]> {
  const posts: Post[] = []

  for (const folder of FOLDERS) {
    const directory = path.join(CONTENT_DIR, folder)
    const files = await readdir(directory)

    for (const file of files) {
      if (!file.endsWith(".mdx")) continue
      const slug = file.slice(0, -4)
      const source = await readFile(path.join(directory, file), "utf8")
      posts.push(parsePostFile(slug, source))
    }
  }

  return posts
}

export function parsePostFile(slug: string, source: string): Post {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Некорректный slug: ${slug}`)
  }

  const parsed = matter(source)
  const data = parsed.data
  const title = requiredString(data.title, slug, "title")
  const description = requiredString(data.description, slug, "description")
  const date = normalizeDate(data.date)
  const tags = normalizeTags(data.tags)
  const status = normalizeEnum(data.status, ["draft", "published"] as const)
  const kind = normalizeEnum(data.kind, ["canon", "signal"] as const)
  const body = parsed.content.trim()

  if (!date) {
    throw new Error(`${slug}: дата должна быть в формате ГГГГ-ММ-ДД`)
  }

  if (!tags) {
    throw new Error(`${slug}: tags должен быть списком известных рубрик`)
  }

  if (!status || !kind) {
    throw new Error(`${slug}: нужны status (draft или published) и kind (canon или signal)`)
  }

  if (!body) {
    throw new Error(`${slug}: пустой текст`)
  }

  const post: Post = {
    slug,
    title,
    description,
    date,
    tags,
    status,
    kind,
    body,
  }

  if (kind === "signal") {
    const sourceUrl = requiredString(data.sourceUrl, slug, "sourceUrl")
    const sourceTitle = requiredString(data.sourceTitle, slug, "sourceTitle")
    const relatedSlug = requiredString(data.relatedSlug, slug, "relatedSlug")

    if (!/^https?:\/\//.test(sourceUrl)) {
      throw new Error(`${slug}: sourceUrl должен начинаться с http`)
    }

    if (!/^[a-z0-9-]+$/.test(relatedSlug)) {
      throw new Error(`${slug}: relatedSlug должен быть slug канона`)
    }

    post.sourceUrl = sourceUrl
    post.sourceTitle = sourceTitle
    post.relatedSlug = relatedSlug
  }

  return post
}

export function visiblePosts(posts: Post[], includeDrafts: boolean) {
  return posts
    .filter((post) => includeDrafts || post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug, "ru"))
}

function requiredString(value: unknown, slug: string, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${slug}: поле ${field} должно быть непустой строкой`)
  }

  return value.trim()
}

function normalizeDate(value: unknown) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear()
    const month = String(value.getUTCMonth() + 1).padStart(2, "0")
    const day = String(value.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return null
}

function normalizeTags(value: unknown): TagId[] | null {
  const list = Array.isArray(value) ? value : typeof value === "string" ? [value] : null
  if (!list || list.length === 0) return null

  const tags: TagId[] = []

  for (const item of list) {
    if (typeof item !== "string" || !isTagId(item) || tags.includes(item)) return null
    tags.push(item)
  }

  return tags
}

function normalizeEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : null
}

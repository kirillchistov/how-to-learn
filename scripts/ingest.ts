import { createHash } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import Parser from "rss-parser"
import { parsePostFile, readAllPosts } from "@/lib/post-file"
import {
  DRAFT_LIMIT,
  SOURCE_MAX_AGE_DAYS,
  ageInDays,
  cleanText,
  normalizeUrl,
  rubricHits,
  scoreCandidate,
  suggestTopic,
} from "@/lib/radar"
import { isTagId, type TagId } from "@/lib/taxonomy"
import type { Post } from "@/lib/types"

const RADAR_DIR = path.join(process.cwd(), "content", "radar")
const ATTEMPT_LIMIT = 6
const USER_AGENT = "how-to-learn-radar/0.1"

const HN_QUERIES = [
  "spaced repetition",
  "deliberate practice",
  "deep work",
  "procrastination",
  "ultralearning",
  "retrieval practice",
  "anki",
]

const RSS_FEEDS = [
  { name: "Scott Young", url: "https://www.scotthyoung.com/blog/feed/" },
  { name: "Cal Newport", url: "https://calnewport.com/blog/feed/" },
  { name: "Farnam Street", url: "https://fs.blog/feed/" },
  { name: "The Learning Scientists", url: "https://www.learningscientists.org/blog?format=rss" },
]

const ARXIV_QUERY = 'all:"spaced repetition" OR all:"retrieval practice" OR all:"desirable difficulties" OR all:"cognitive load"'

type Origin = "hn" | "rss" | "arxiv"

type Candidate = {
  title: string
  url: string
  summary: string
  publishedAt: string
  points?: number
  origin: Origin
  score: number
}

type HnHit = {
  title?: string | null
  url?: string | null
  points?: number | null
  created_at_i?: number | null
  story_text?: string | null
}

const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": USER_AGENT },
})

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const posts = await readAllPosts()
  const seen = new Set(
    posts.flatMap((post) => (post.sourceUrl ? [safeNormalize(post.sourceUrl)] : [])).filter((url) => url !== null),
  )
  const candidates = (await collectCandidates()).filter((candidate) => !seen.has(candidate.url))
  candidates.sort((a, b) => b.score - a.score || b.publishedAt.localeCompare(a.publishedAt))

  console.log(`Кандидатов после фильтра: ${candidates.length}`)

  if (dryRun) {
    for (const candidate of candidates.slice(0, 8)) {
      console.log(
        `${candidate.score.toFixed(1)}\t${candidate.origin}\t${candidate.title}\t${candidate.url}`,
      )
    }
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error("OPENAI_API_KEY не задан. Сбор остановлен.")
    process.exitCode = 1
    return
  }

  const canon = posts.filter((post) => post.kind === "canon")
  if (canon.length === 0) {
    console.error("В каноне нет статей, черновик не к чему привязать.")
    process.exitCode = 1
    return
  }

  await mkdir(RADAR_DIR, { recursive: true })
  const usedSlugs = new Set(posts.map((post) => post.slug))
  let written = 0
  let failed = 0

  for (const candidate of candidates) {
    if (written >= DRAFT_LIMIT || written + failed >= ATTEMPT_LIMIT) break

    try {
      const file = await renderDraft(candidate, canon, usedSlugs, apiKey)
      await writeFile(file.path, file.source, "utf8")
      written += 1
      console.log(`Черновик: ${path.relative(process.cwd(), file.path)}`)
    } catch (error) {
      failed += 1
      console.error(`Не удалось написать черновик «${candidate.title}»:`, error instanceof Error ? error.message : error)
    }
  }

  if (candidates.length > 0 && written === 0) {
    process.exitCode = 1
  }
}

async function collectCandidates() {
  const batches = await Promise.all([collectHn(), collectRss(), collectArxiv()])
  const byUrl = new Map<string, Candidate>()

  for (const candidate of batches.flat()) {
    const current = byUrl.get(candidate.url)
    if (!current || candidate.score > current.score) byUrl.set(candidate.url, candidate)
  }

  return [...byUrl.values()]
}

async function collectHn(): Promise<Candidate[]> {
  const since = Math.floor(Date.now() / 1000) - SOURCE_MAX_AGE_DAYS.hn * 24 * 60 * 60
  const batches = await Promise.all(HN_QUERIES.map((query) => fetchHn(query, since)))
  return batches.flat()
}

async function fetchHn(query: string, since: number): Promise<Candidate[]> {
  const filter = `created_at_i>${since},points>=5`
  const endpoint = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=15&numericFilters=${encodeURIComponent(filter)}`

  try {
    const response = await fetch(endpoint, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    })
    if (!response.ok) throw new Error(`HN ${response.status}`)
    const payload = (await response.json()) as { hits?: HnHit[] }
    return (payload.hits ?? []).flatMap((hit) => toCandidate({
      origin: "hn",
      title: hit.title ?? "",
      url: hit.url ?? "",
      summary: hit.story_text || hit.title || "",
      publishedAt: hit.created_at_i ? new Date(hit.created_at_i * 1000).toISOString() : "",
      points: hit.points ?? undefined,
      maxAge: SOURCE_MAX_AGE_DAYS.hn,
    }))
  } catch (error) {
    console.error(`HN «${query}» пропущен:`, error instanceof Error ? error.message : error)
    return []
  }
}

async function collectRss(): Promise<Candidate[]> {
  const batches = await Promise.all(RSS_FEEDS.map((feed) => fetchFeed(feed)))
  return batches.flat()
}

async function fetchFeed(feed: { name: string; url: string }): Promise<Candidate[]> {
  try {
    const parsed = await parser.parseURL(feed.url)
    return (parsed.items ?? []).flatMap((item) => toCandidate({
      origin: "rss",
      title: item.title ?? "",
      url: item.link ?? "",
      summary: item.contentSnippet || item.content || "",
      publishedAt: item.isoDate || item.pubDate || "",
      maxAge: SOURCE_MAX_AGE_DAYS.rss,
    }))
  } catch (error) {
    console.error(`RSS «${feed.name}» пропущен:`, error instanceof Error ? error.message : error)
    return []
  }
}

async function collectArxiv(): Promise<Candidate[]> {
  const endpoint = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(ARXIV_QUERY)}&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending`

  try {
    const parsed = await parser.parseURL(endpoint)
    return (parsed.items ?? []).flatMap((item) => toCandidate({
      origin: "arxiv",
      title: item.title ?? "",
      url: item.link || item.guid || "",
      summary: item.contentSnippet || item.content || "",
      publishedAt: item.isoDate || item.pubDate || "",
      maxAge: SOURCE_MAX_AGE_DAYS.arxiv,
    }))
  } catch (error) {
    console.error("arXiv пропущен:", error instanceof Error ? error.message : error)
    return []
  }
}

function toCandidate(input: {
  origin: Origin
  title: string
  url: string
  summary: string
  publishedAt: string
  points?: number
  maxAge: number
}): Candidate[] {
  const title = cleanText(input.title)
  const summary = cleanText(input.summary).slice(0, 600)
  const url = safeNormalize(input.url)
  const publishedAt = Date.parse(input.publishedAt)

  if (!title || !url || Number.isNaN(publishedAt)) return []

  const age = ageInDays(new Date(publishedAt).toISOString())
  if (age > input.maxAge) return []

  const hits = rubricHits(title, summary)
  const score = scoreCandidate(hits, age, input.points)
  if (score <= 0) return []

  return [{
    title,
    url,
    summary,
    publishedAt: new Date(publishedAt).toISOString(),
    points: input.points,
    origin: input.origin,
    score,
  }]
}

async function renderDraft(
  candidate: Candidate,
  canon: Post[],
  usedSlugs: Set<string>,
  apiKey: string,
) {
  const suggestion = suggestTopic(candidate.title, candidate.summary)
  const related = canon.some((post) => post.slug === suggestion.slug) ? suggestion.slug : canon[0].slug
  const draft = await requestDraft(candidate, canon, related, suggestion.tag, apiKey)
  const date = new Date().toISOString().slice(0, 10)
  const slug = uniqueSlug(date, draft.title, candidate.url, usedSlugs)
  const source = matter.stringify(`${draft.body.trim()}\n`, {
    title: draft.title,
    description: draft.description,
    date,
    tags: draft.tags,
    status: "draft",
    kind: "signal",
    sourceUrl: candidate.url,
    sourceTitle: candidate.title,
    relatedSlug: draft.relatedSlug,
  })

  parsePostFile(slug, source)

  return { path: path.join(RADAR_DIR, `${slug}.mdx`), source }
}

async function requestDraft(
  candidate: Candidate,
  canon: Post[],
  relatedSlug: string,
  tag: TagId,
  apiKey: string,
) {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Ты редактор блога «Научиться учиться». Пишешь по-русски, коротко и конкретно.",
            "Читатель борется с прокрастинацией, расфокусом, учёбой без видимой цели и прогрессом, который не ощущается.",
            "Не копируй источник и не пересказывай его абзацами. Можно одну цитату короче предложения.",
            "Не выдумывай цифры и выводы, которых нет во фрагменте. Это сигнал, не научная статья.",
            "Свяжи заметку с одной канонической статьёй и дай один шаг на сегодня.",
            "Ответ — только JSON.",
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify({
            source: {
              title: candidate.title,
              url: candidate.url,
              origin: candidate.origin,
              summary: candidate.summary,
            },
            suggestedCanon: relatedSlug,
            suggestedTag: tag,
            canon: canon.map((post) => ({
              slug: post.slug,
              title: post.title,
              description: post.description,
            })),
            tags: ["procrastination", "attention", "progress", "purpose", "memory", "practice", "feynman", "oakley", "kaufman"],
            shape: {
              title: "свой заголовок, не копия источника",
              description: "одно предложение",
              tags: ["от одного до трёх id из списка"],
              relatedSlug: "slug из canon",
              body: "markdown с заголовками ## О чём сигнал, ## Почему это про учёбу, ## Что сделать сегодня",
            },
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(60000),
  })

  const payload = (await response.json()) as {
    error?: { message?: string }
    choices?: { message?: { content?: string } }[]
  }

  if (!response.ok) {
    throw new Error(payload.error?.message || `Модель ответила ${response.status}`)
  }

  const raw = payload.choices?.[0]?.message?.content
  if (!raw) throw new Error("Пустой ответ модели")

  return normalizeDraft(raw, canon, relatedSlug, tag)
}

function normalizeDraft(raw: string, canon: Post[], relatedSlug: string, tag: TagId) {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
  const value = JSON.parse(trimmed) as unknown
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Модель вернула не объект")
  }

  const record = value as Record<string, unknown>
  const title = shortString(record.title, 160)
  const description = shortString(record.description, 240)
  const body = typeof record.body === "string" ? record.body.trim() : ""
  const canonSlugs = new Set(canon.map((post) => post.slug))
  const modelSlug = typeof record.relatedSlug === "string" ? record.relatedSlug : ""
  const tags = normalizeTags(record.tags, tag)

  if (!title || !description) throw new Error("В ответе нет заголовка или описания")
  if (body.length < 180 || body.length > 2500) {
    throw new Error(`Длина заметки ${body.length}, нужна от 180 до 2500 знаков`)
  }

  return {
    title,
    description,
    body,
    tags,
    relatedSlug: canonSlugs.has(modelSlug) ? modelSlug : relatedSlug,
  }
}

function normalizeTags(value: unknown, fallback: TagId): TagId[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? [value] : []
  const tags: TagId[] = []

  for (const item of list) {
    if (typeof item === "string" && isTagId(item) && !tags.includes(item)) tags.push(item)
    if (tags.length === 3) break
  }

  return tags.length > 0 ? tags : [fallback]
}

function shortString(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  const text = cleanText(value)
  return text.length > max ? "" : text
}

function uniqueSlug(date: string, title: string, url: string, usedSlugs: Set<string>) {
  const words = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
    .replace(/-$/g, "")
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 8)
  const base = `${date}-${words || hash}`
  let slug = base
  let index = 2

  while (usedSlugs.has(slug)) {
    slug = `${base}-${index}`
    index += 1
  }

  usedSlugs.add(slug)
  return slug
}

function safeNormalize(raw: string) {
  try {
    return normalizeUrl(raw)
  } catch {
    return null
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

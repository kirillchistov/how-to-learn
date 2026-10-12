import type { TagId } from "@/lib/taxonomy"

export const SOURCE_MAX_AGE_DAYS = {
  hn: 7,
  rss: 21,
  arxiv: 180,
} as const

export const DRAFT_LIMIT = 3

const GATE_KEYWORDS = [
  "spaced repetition",
  "anki",
  "retrieval practice",
  "active recall",
  "interleaving",
  "deliberate practice",
  "deep work",
  "procrastination",
  "procrastinate",
  "ultralearning",
  "feynman",
  "forgetting curve",
  "desirable difficulties",
  "cognitive load",
  "learning how to learn",
  "skill acquisition",
  "diffuse mode",
  "illusion of competence",
  "pomodoro",
  "first 20 hours",
  "make it stick",
  "barbara oakley",
  "josh kaufman",
  "прокрастинац",
  "кривая забывания",
  "интервальные повторения",
]

const TOPIC_LINKS: { slug: string; tag: TagId; keywords: string[] }[] = [
  {
    slug: "procrastination-loop",
    tag: "procrastination",
    keywords: ["procrastinat", "pomodoro", "willpower", "прокрастинац"],
  },
  {
    slug: "oakley-attention",
    tag: "attention",
    keywords: ["deep work", "focus", "attention", "diffuse", "cognitive load"],
  },
  {
    slug: "forgetting-curve",
    tag: "memory",
    keywords: ["spaced", "forgetting", "anki", "repetition", "ebbinghaus", "кривая забывания"],
  },
  {
    slug: "retrieval-interleaving",
    tag: "practice",
    keywords: ["retrieval", "interleav", "active recall", "desirable difficul"],
  },
  {
    slug: "feynman-method",
    tag: "feynman",
    keywords: ["feynman", "explain like", "illusion of competence"],
  },
  {
    slug: "kaufman-principles",
    tag: "kaufman",
    keywords: ["ultralearning", "deliberate practice", "20 hours", "skill acquisition", "kaufman"],
  },
  {
    slug: "project-not-abstraction",
    tag: "purpose",
    keywords: ["project-based", "side project", "portfolio"],
  },
  {
    slug: "visible-progress",
    tag: "progress",
    keywords: ["feedback", "progress", "mastery"],
  },
]

export function rubricHits(title: string, summary: string) {
  const haystack = `${title}\n${summary}`
  return GATE_KEYWORDS.filter((keyword) => hasKeyword(haystack, keyword)).length
}

export function scoreCandidate(hits: number, ageDays: number, points?: number) {
  if (hits === 0) return 0
  const freshness = Math.max(0, 14 - ageDays) / 7
  const popularity = Math.min(points ?? 0, 200) / 40
  return hits * 3 + freshness + popularity
}

export function suggestTopic(title: string, summary: string): { slug: string; tag: TagId } {
  const haystack = `${title}\n${summary}`.toLowerCase()

  for (const topic of TOPIC_LINKS) {
    if (topic.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return { slug: topic.slug, tag: topic.tag }
    }
  }

  return { slug: "visible-progress", tag: "progress" }
}

export function ageInDays(iso: string, now = Date.now()) {
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return Number.POSITIVE_INFINITY
  return (now - time) / (24 * 60 * 60 * 1000)
}

export function normalizeUrl(raw: string) {
  const url = new URL(raw)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Неподдерживаемая ссылка: ${raw}`)
  }

  url.hash = ""

  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key)
  }

  const hostname = url.hostname.replace(/^www\./, "").toLowerCase()
  const pathname = url.pathname.replace(/\/$/, "")
  const query = url.searchParams.toString()

  return `${url.protocol}//${hostname}${pathname}${query ? `?${query}` : ""}`
}

export function cleanText(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim()
}

function hasKeyword(haystack: string, keyword: string) {
  if (keyword.includes(" ") || /[^\u0000-\u007f]/.test(keyword)) {
    return haystack.toLowerCase().includes(keyword.toLowerCase())
  }

  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(haystack)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

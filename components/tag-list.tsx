import Link from "next/link"
import { TAGS, type TagId } from "@/lib/taxonomy"

export function TagList({ tags }: { tags: readonly TagId[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${tag}`}
            className="text-sm text-zinc-500 underline decoration-zinc-200 underline-offset-4 hover:text-zinc-950 hover:decoration-zinc-400"
          >
            {TAGS[tag]}
          </Link>
        </li>
      ))}
    </ul>
  )
}

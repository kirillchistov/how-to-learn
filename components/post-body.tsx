import type { ComponentProps } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { KaufmanFigure } from "@/components/kaufman-figure"

const components = {
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-10 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: ComponentProps<"p">) => <p className="mt-4 leading-7 text-zinc-800" {...props} />,
  ul: (props: ComponentProps<"ul">) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-zinc-800" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 leading-7 text-zinc-800" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li {...props} />,
  a: ({ href, ...props }: ComponentProps<"a">) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href)

    return (
      <a
        href={href}
        {...props}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-800"
      />
    )
  },
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="mt-4 border-l-2 border-zinc-300 pl-4 leading-7 text-zinc-600" {...props} />
  ),
  KaufmanFigure,
}

export async function PostBody({ source }: { source: string }) {
  return (
    <div className="mt-8">
      {await MDXRemote({ source, components })}
    </div>
  )
}

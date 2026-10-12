import Image from "next/image"
import Link from "next/link"

const LINKS = [
  { href: "/#materials", label: "Материалы" },
  { href: "/radar", label: "Радар" },
  { href: "/about", label: "О блоге" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/landing/logo_place_header.svg"
            alt="Яндекс Практикум"
            width={183}
            height={32}
            priority
            unoptimized
          />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

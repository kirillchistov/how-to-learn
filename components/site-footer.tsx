import Image from "next/image"

const MENU = [
  { href: "https://practicum.yandex.ru/", label: "Главная" },
  { href: "https://practicum.yandex.ru/catalog/management/", label: "Менеджмент" },
  { href: "https://education.yandex.ru/", label: "Образование" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1f1f1f] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <Image
          src="/landing/logo_place_footer.svg"
          alt="Яндекс Практикум"
          width={184}
          height={36}
          unoptimized
          className="brightness-0 invert"
        />
        <div>
          <p className="text-lg font-bold">О практикуме</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {MENU.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer" className="hover:opacity-80">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg">© 2022-2026. Кирилл Чистов</p>
        </div>
      </div>
    </footer>
  )
}

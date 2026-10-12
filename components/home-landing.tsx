import Image from "next/image"
import Link from "next/link"
import { PostList } from "@/components/post-list"
import { TagList } from "@/components/tag-list"
import { getVisiblePosts } from "@/lib/posts"
import { PAIN_TAGS } from "@/lib/taxonomy"

const TECHNIQUES = [
  {
    href: "/posts/oakley-attention",
    image: "/landing/cards-attention.png",
    title: "Два вида внимания",
    text: "Глубокие знания возникают, если чередовать сфокусированное и рассеянное мышление.",
  },
  {
    href: "/posts/retrieval-interleaving",
    image: "/landing/cards-recall.png",
    title: "Recall",
    text: "Вспоминайте изученное — это позволит соединить разрозненные порции памяти.",
  },
  {
    href: "/posts/retrieval-interleaving",
    image: "/landing/cards-interliving.png",
    title: "Интерливинг",
    text: "Изучайте несколько навыков одновременно, они обогащают друг друга.",
  },
  {
    href: "/posts/oakley-attention",
    image: "/landing/cards-question.png",
    title: "Вопросы",
    text: "Слушая преподавателя, придумывайте хороший вопрос, который вас действительно волнует.",
  },
  {
    href: "/posts/feynman-method",
    image: "/landing/cards-competence.png",
    title: "Иллюзия компетентности",
    text: "Повторите про себя, запишите, расскажите другу: вам только кажется, что вы владеете новой темой.",
  },
]

const DIGITS = [
  { heading: "86 миллиардов", lines: ["Число нейронов в мозге человека"] },
  {
    heading: "2.1 миллиарда",
    lines: ["Число нуждающихся в повышении квалификации", "Всемирный Банк, 2017"],
  },
  { heading: "1000 терабайт", lines: ["Объём памяти человека"] },
  {
    heading: "500 триллионов",
    lines: ["Число ответственных за обучение нервных синапсов у взрослого человека"],
  },
  {
    heading: "420 миллионов",
    lines: [
      "Число взрослых людей моложе 25 лет, не имеющих образования для трудоустройства",
      "Всемирный Банк, 2017",
    ],
  },
  { heading: "17–20 лет", lines: ["Пик обучаемости"] },
  { heading: "1885 год", lines: ["Открытие кривой забывания"] },
  { heading: "1889 год", lines: ["Открытие условного рефлекса"] },
]

const PRINCIPLES = [
  "Выберите привлекательный проект.",
  "Сосредоточьтесь на каком-то одном навыке.",
  "Определите целевой уровень мастерства.",
  "Разбейте навык на элементы.",
  "Приготовьте всё необходимое для занятий.",
  "Устраните препятствия для занятий.",
  "Выделите специальное время для занятий.",
  "Создайте быстрые петли обратной связи.",
  "Занимайтесь по расписанию, короткими интенсивными интервалами.",
  "Уделяйте внимание количеству и скорости.",
]

const RESOURCES = [
  {
    href: "https://arzamas.academy/",
    src: "/landing/resources-arzamas.svg",
    alt: "Радио Арзамас",
    width: 177,
    height: 27,
  },
  {
    href: "https://nplus1.ru/",
    src: "/landing/resources-n1.svg",
    alt: "Эн плюс один",
    width: 89,
    height: 36,
  },
  {
    href: "https://strelka.com/",
    src: "/landing/resources-strelka.svg",
    alt: "Стрелка",
    width: 160,
    height: 32,
  },
  {
    href: "https://polka.academy/",
    src: "/landing/resources-polka.svg",
    alt: "Полка",
    width: 187,
    height: 38,
  },
]

const VIDEOS = [
  {
    src: "https://www.youtube.com/embed/5MgBikgcWnY?controls=0",
    title: "Видео. Джош Кауфман: Как научиться чему угодно. Первые 20 часов",
  },
  {
    src: "https://www.youtube.com/embed/arj7oStGLkU?controls=0",
    title: "Видео. Тим Урбан: Что в голове у мастер-прокрастинатора",
  },
]

function SectionTitle({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`px-6 text-center text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${dark ? "text-white" : ""}`}
    >
      {children}
    </h2>
  )
}

function SectionSubtitle({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mt-4 px-6 text-center text-lg sm:text-2xl ${dark ? "text-white" : ""}`}>{children}</p>
  )
}

function TwoColumns({
  brief,
  children,
}: {
  brief: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 md:grid-cols-[11rem_1fr] md:gap-16">
      <h2 className="text-lg leading-7 text-[#2f80ed]">{brief}</h2>
      <div className="space-y-6 text-lg leading-8 sm:text-2xl sm:leading-9">{children}</div>
    </div>
  )
}

export async function HomeLanding() {
  const posts = await getVisiblePosts()

  return (
    <>
      <section className="relative overflow-hidden bg-[#f2f2f2]">
        <div
          aria-hidden
          className="landing-spin pointer-events-none absolute top-16 right-0 hidden size-72 bg-[#2f80ed] lg:block lg:size-[28rem]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-end gap-8 px-6 pt-12 pb-10 lg:min-h-[36rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:px-16 lg:pt-24 lg:pb-8">
          <div className="relative z-10 max-w-xl pb-4">
            <h1 className="text-5xl font-bold leading-none tracking-tight sm:text-7xl lg:text-[6.4rem] lg:leading-[0.94]">
              Научиться учиться
            </h1>
            <p className="mt-8 max-w-sm text-lg leading-7">
              Какие современные и эффективные подходы к обучению вы можете использовать в своей жизни?{" "}
              <Link href="#techniques" className="whitespace-nowrap text-[#2f80ed] hover:opacity-80">
                Узнать →
              </Link>
            </p>
          </div>
          <Image
            src="/landing/header-image.png"
            alt=""
            width={713}
            height={607}
            priority
            className="relative z-10 h-auto w-full justify-self-end"
          />
        </div>
      </section>

      <section id="problems" className="py-16 lg:py-24">
        <TwoColumns brief="Главные проблемы в обучении">
          <p>
            Ни в школе, ни в институте нас не учат тому, как правильно изучать материал. Мы готовимся к
            экзаменам и учим билеты. Мы тренируемся решать однообразные задачи, чтобы лучше сдать тест, но
            часто в итоге это не дает нам реального знания. Зубрежка быстро выветривается и не приносит
            пользы.
          </p>
          <p>
            <span className="font-bold">Вывод:</span> учиться тоже нужно уметь, но почему-то этому мало где
            учат. Что с этим делать?
          </p>
          <p>
            Конкретные техники и упражнения помогают изменить подход к обучению, сделать его эффективным и
            захватывающим. Эти же техники применяются на примере обучения в Практикуме.
          </p>
        </TwoColumns>
      </section>

      <section id="techniques" className="pb-16 lg:pb-24">
        <SectionTitle>Техники обучения</SectionTitle>
        <SectionSubtitle>Пять практик от Барбары Оакли</SectionSubtitle>
        <ul className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-x-6 gap-y-12 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNIQUES.map((card) => (
            <li key={card.title} className="text-center">
              <Link href={card.href} className="group block hover:opacity-80">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={160}
                  height={160}
                  className="mx-auto size-40 rounded-full"
                />
                <h3 className="mt-6 text-2xl font-bold">{card.title}</h3>
                <p className="mt-3 text-lg leading-7">{card.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-16 lg:pb-24">
        <SectionTitle>Видео нa TED</SectionTitle>
        <SectionSubtitle>Для тех, кто любит прокрастинировать</SectionSubtitle>
        <ul className="mx-auto mt-10 grid w-full max-w-5xl gap-8 px-6 md:grid-cols-2">
          {VIDEOS.map((video) => (
            <li key={video.src}>
              <div className="aspect-video w-full bg-zinc-100">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-16 lg:pb-24">
        <TwoColumns
          brief={
            <Link href="/posts/oakley-attention" className="hover:opacity-80">
              История Барбары Оакли.
            </Link>
          }
        >
          <p>
            С детства Барбаре не давалась математика. Она считала себя законченным гуманитарием, причём далеко
            не самым умным. В армии она изучала русский язык, чтобы получить надбавку, да так успешно, что её
            выдвинули в командиры. Но для продвижения по службе нужно было сдавать математику. И тогда Барбара
            придумала свой подход к точным наукам. Оказалось, если вам что-то «плохо даётся», ваши добытые
            трудом знания гораздо глубже, чем у тех, кому всё ясно с первого взгляда.
          </p>
        </TwoColumns>
      </section>

      <section className="bg-[#f2f2f2]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <Image
            src="/landing/feynman.png"
            alt=""
            width={867}
            height={637}
            className="h-auto w-full"
          />
          <div className="text-center lg:pb-8 lg:text-left">
            <h2 className="text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">Метод Фейнмана</h2>
            <p className="mt-6 text-2xl">Выучить и не забыть.</p>
            <Link
              href="/posts/feynman-method"
              className="mt-6 inline-block text-lg text-[#2f80ed] hover:opacity-80"
            >
              Подробнее →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <SectionTitle>Цифры и факты</SectionTitle>
        <SectionSubtitle>Про учёбу и мозг</SectionSubtitle>
        <ul className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-x-8 gap-y-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {DIGITS.map((item) => (
            <li key={item.heading}>
              <h3 className="text-2xl font-bold">{item.heading}</h3>
              {item.lines.map((line) => (
                <p key={line} className="mt-3 text-lg leading-6">
                  {line}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f2f2f2]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:py-24">
          <div>
            <p className="text-lg">Салман Хан</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Весь мир — школа</h2>
            <blockquote className="mt-8 text-lg leading-8">
              Страсть и новаторство Сала Хана меняют процесс обучения миллионов студентов по всему миру. Книгу
              «Весь мир — школа» нужно прочитать всем, кто занимается образованием — так учащиеся повсюду
              смогут получить навыки и знания, которые приносят успех в школе, карьере и жизни.
            </blockquote>
            <p className="mt-6 font-bold">Джордж Лукас</p>
            <p className="mt-1 text-lg">Кинорежиссер, продюсер</p>
          </div>
          <figure className="mx-auto w-48 lg:w-full">
            <Image
              src="/landing/khan-book.jpg"
              alt="Салман Хан. Весь мир - школа"
              width={700}
              height={1001}
              className="h-auto w-full"
            />
          </figure>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1f1f1f] py-16 text-white lg:py-24">
        <Image
          src="/images/kaufman-triangle.svg"
          alt=""
          width={877}
          height={877}
          unoptimized
          className="pointer-events-none absolute top-0 -right-24 hidden w-[28rem] opacity-80 lg:block"
        />
        <div className="relative">
          <SectionTitle dark>Принципы обучения</SectionTitle>
          <SectionSubtitle dark>от Джоша Кауфмана</SectionSubtitle>
          <p className="mt-4 text-center">
            <Link href="/posts/kaufman-principles" className="text-[#2f80ed] hover:opacity-80">
              Читать разбор →
            </Link>
          </p>
          <ol className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-x-8 gap-y-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((text, index) => (
              <li key={text}>
                <h3 className="text-2xl font-bold">{index + 1}</h3>
                <p className="mt-3 text-lg leading-6">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <SectionTitle>Полезные ресурсы</SectionTitle>
        <SectionSubtitle>Больше материалов о техниках и лайфхаках обучения</SectionSubtitle>
        <ul className="mx-auto mt-12 flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-8 px-6">
          {RESOURCES.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer" className="hover:opacity-80">
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} unoptimized />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="materials" className="border-t border-zinc-200 py-16 lg:py-24">
        <div className="mx-auto w-full max-w-2xl px-6">
          <h2 className="text-4xl font-bold tracking-tight">Материалы</h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Разборы техник из лендинга и новые заметки. У каждой есть шаг, который можно сделать сегодня.
          </p>
          <TagList tags={PAIN_TAGS} />
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}

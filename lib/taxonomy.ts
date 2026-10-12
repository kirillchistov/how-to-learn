export const TAGS = {
  procrastination: "Прокрастинация",
  attention: "Внимание",
  progress: "Прогресс",
  purpose: "Цель",
  memory: "Память",
  practice: "Практика",
  feynman: "Фейнман",
  oakley: "Оакли",
  kaufman: "Кауфман",
} as const

export type TagId = keyof typeof TAGS

export const PAIN_TAGS = [
  "procrastination",
  "attention",
  "purpose",
  "progress",
] as const satisfies readonly TagId[]

export const KIND_LABEL = {
  canon: "Канон",
  signal: "Сигнал",
} as const

export function isTagId(value: string): value is TagId {
  return Object.prototype.hasOwnProperty.call(TAGS, value)
}

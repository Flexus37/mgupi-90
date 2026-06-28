import type { QuestResult } from '../types'
import type { AppIconName } from '../components/AppIcon'

export type QuestTone = 'future' | 'community' | 'projects'
export type QuestOption = { id: string; label: string; description: string; icon: AppIconName; tone: QuestTone }

export const memoryOptions: QuestOption[] = [
  { id: 'knowledge', label: 'Знания', description: 'Идеи и открытия, которые передают дальше.', icon: 'brain', tone: 'future' },
  { id: 'memories', label: 'Воспоминания', description: 'Моменты, места и личные истории.', icon: 'heart', tone: 'community' },
  { id: 'projects', label: 'Проекты', description: 'То, что удалось придумать и воплотить.', icon: 'cube', tone: 'projects' },
  { id: 'atmosphere', label: 'Атмосфера', description: 'Люди, команды и чувство причастности.', icon: 'usersThree', tone: 'community' },
]

export const futureOptions: QuestOption[] = [
  { id: 'tech', label: 'Технологичный университет', description: 'Точная инженерия и сильные цифровые инструменты.', icon: 'circuitry', tone: 'future' },
  { id: 'creative', label: 'Творческая лаборатория', description: 'Среда свободного эксперимента и прототипов.', icon: 'flask', tone: 'projects' },
  { id: 'team', label: 'Команда исследователей', description: 'Большие задачи решаются вместе.', icon: 'users', tone: 'community' },
  { id: 'digital', label: 'Открытый цифровой кампус', description: 'Знания доступны из любой точки.', icon: 'buildings', tone: 'future' },
]

export const roleOptions: QuestOption[] = [
  { id: 'inventor', label: 'Изобретатель', description: 'Собираю решение и проверяю его на практике.', icon: 'hammer', tone: 'projects' },
  { id: 'researcher', label: 'Исследователь', description: 'Задаю вопросы и нахожу закономерности.', icon: 'lightbulb', tone: 'future' },
  { id: 'connector', label: 'Объединяющий', description: 'Помогаю людям услышать друг друга.', icon: 'usersThree', tone: 'community' },
]

const results: Record<QuestTone, QuestResult> = {
  projects: { code: 'MAKER / 90', title: 'Капсула создателя', description: 'Твой маршрут строится вокруг действия: придумать, собрать, проверить и показать результат. В будущее ты передаёшь смелость превращать идею в работающий проект.' },
  future: { code: 'VISION / 90', title: 'Капсула исследователя', description: 'Тебя ведут любопытство и желание смотреть дальше привычного. В капсуле останутся вопросы, знания и готовность проектировать новые инструменты.' },
  community: { code: 'PEOPLE / 90', title: 'Капсула сообщества', description: 'Главная ценность для тебя — люди и совместный опыт. В будущее отправятся голоса, встречи и атмосфера, в которой возникают сильные команды.' },
}

export function calculateResult(...ids: string[]): QuestResult {
  const all = [...memoryOptions, ...futureOptions, ...roleOptions]
  const score: Record<QuestTone, number> = { future: 0, community: 0, projects: 0 }
  ids.forEach((id) => { const tone = all.find((item) => item.id === id)?.tone; if (tone) score[tone] += 1 })
  const winner = (Object.keys(score) as QuestTone[]).sort((a, b) => score[b] - score[a])[0]
  return results[winner]
}

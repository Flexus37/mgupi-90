import { useMemo, useState } from 'react'
import { calculateResult, futureOptions, memoryOptions, roleOptions, type QuestOption } from '../data/quests'
import type { QuestResult } from '../types'
import { AppIcon } from './AppIcon'

type Props = { onResult: (value: QuestResult | null) => void }
type Stage = 0 | 1 | 2 | 3

const stages = [
  { kicker: 'Артефакт памяти', title: <>Что важно <em>сохранить?</em></>, hint: 'Выберите то, без чего история университета была бы неполной.', options: memoryOptions },
  { kicker: 'Образ горизонта', title: <>Каким должно быть <em>будущее?</em></>, hint: 'Представьте университет, в котором хотелось бы учиться и создавать.', options: futureOptions },
  { kicker: 'Ваша роль', title: <>Кем вы становитесь <em>в этом будущем?</em></>, hint: 'Последний выбор определит характер вашей цифровой капсулы.', options: roleOptions },
] as const

export function QuestSection({ onResult }: Props) {
  const [stage, setStage] = useState<Stage>(0)
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const result = useMemo(() => stage === 3 ? calculateResult(...answers) : null, [answers, stage])
  const current = stages[Math.min(stage, 2)]
  const choose = (id: string) => setAnswers((value) => value.map((answer, index) => index === stage ? id : answer))
  const next = () => {
    if (!answers[stage]) return
    if (stage === 2) { const value = calculateResult(...answers); onResult(value); setStage(3) }
    else setStage((stage + 1) as Stage)
  }
  const back = () => stage > 0 && setStage((stage - 1) as Stage)
  const reset = () => { setStage(0); setAnswers(['', '', '']); onResult(null) }

  return (
    <section className="section quest-section" id="quest">
      <div className="page-shell">
        <div className="quest-heading">
          <div><p className="section-index">03 / Маршрут капсулы</p><p className="quest-heading-note">Три выбора. Один персональный профиль.</p></div>
          <div className="quest-progress" aria-label={`Этап ${Math.min(stage + 1, 4)} из 4`}>
            {[0, 1, 2, 3].map((item) => <span key={item} className={stage >= item ? 'active' : ''}>{String(item + 1).padStart(2, '0')}</span>)}
          </div>
        </div>

        <div className="quest-panel">
          {stage < 3 && <div className="quest-step">
            <div className="quest-copy"><p className="quest-kicker">{current.kicker}</p><h2>{current.title}</h2><p className="quest-hint">{current.hint}</p></div>
            <div className={`option-grid ${current.options.length === 3 ? 'option-grid-three' : ''}`}>
              {current.options.map((item: QuestOption) => <button key={item.id} className={answers[stage] === item.id ? 'option active' : 'option'} onClick={() => choose(item.id)} aria-pressed={answers[stage] === item.id}>
                <span className="option-icon"><AppIcon name={item.icon} size={29} /></span><strong>{item.label}</strong><small>{item.description}</small><i>{answers[stage] === item.id ? <AppIcon name="checkCircle" size={22} /> : <AppIcon name="arrowUpRight" size={18} />}</i>
              </button>)}
            </div>
            <div className="quest-controls">
              <button className="text-button" onClick={back} disabled={stage === 0}><AppIcon name="arrowLeft" size={16} /> Назад</button>
              <button className="button button-primary" onClick={next} disabled={!answers[stage]}>{stage === 2 ? 'Открыть капсулу' : 'Продолжить'} <AppIcon name="arrowRight" size={18} /></button>
            </div>
          </div>}

          {stage === 3 && result && <div className="quest-result">
            <div className="result-orbit"><span>90</span><i /><b><AppIcon name="trophy" size={28} /></b></div>
            <div><p className="quest-kicker">Маршрут завершён · {result.code}</p><h2>{result.title}</h2><p>{result.description}</p><div className="result-actions"><a className="button button-primary" href="#crossword">Принять вызов <AppIcon name="puzzle" size={19} /></a><button className="text-button" onClick={reset}>Пройти ещё раз</button></div></div>
          </div>}
        </div>
      </div>
    </section>
  )
}

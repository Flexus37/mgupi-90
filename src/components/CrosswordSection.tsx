import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AppIcon } from './AppIcon'

type Direction = 'across' | 'down'
type Word = { id: string; number: number; answer: string; clue: string; hint: string; direction: Direction; row: number; col: number }
type Props = { onComplete: (value: boolean) => void }
type SavedCrossword = { values: Record<string, string>; revealed: string[]; expandedHints: string[]; complete: boolean }

const STORAGE_KEY = 'mgupi-90-crossword'
const GRID_SIZE = 11
const words: Word[] = [
  { id: 'university', number: 1, answer: 'УНИВЕРСИТЕТ', clue: 'Пространство, где встречаются образование, исследование и сообщество.', hint: 'Здесь студенты получают профессию, работают в лабораториях и создают первые большие проекты.', direction: 'down', row: 1, col: 6 },
  { id: 'future', number: 2, answer: 'БУДУЩЕЕ', clue: 'Время, которому адресована цифровая капсула.', hint: 'Оно ещё не наступило, но именно для него сохраняют сегодняшние идеи и воспоминания.', direction: 'across', row: 1, col: 5 },
  { id: 'device', number: 3, answer: 'ПРИБОР', clue: 'Объект, с которого начинается точное измерение.', hint: 'Так называют техническое устройство для наблюдения, контроля или измерения величин.', direction: 'across', row: 3, col: 4 },
  { id: 'memory', number: 4, answer: 'ПАМЯТЬ', clue: 'То, что связывает опыт разных поколений.', hint: 'Она помогает сохранять события, лица и ощущения, даже когда проходит много лет.', direction: 'down', row: 3, col: 4 },
  { id: 'project', number: 5, answer: 'ПРОЕКТ', clue: 'Идея, превращённая в продуманное решение.', hint: 'У него есть цель, этапы работы и результат, который можно представить аудитории.', direction: 'across', row: 6, col: 5 },
  { id: 'code', number: 6, answer: 'КОД', clue: 'Язык, на котором создаются цифровые продукты.', hint: 'Короткое слово из трёх букв: его пишет программист, чтобы сайт или приложение работали.', direction: 'down', row: 5, col: 7 },
  { id: 'design', number: 7, answer: 'ДИЗАЙН', clue: 'Дисциплина, которая соединяет смысл, форму и сценарий.', hint: 'Он отвечает не только за красоту, но и за то, насколько удобно человеку пользоваться продуктом.', direction: 'across', row: 8, col: 5 },
]

const cellKey = (row: number, col: number) => `${row}-${col}`

const emptySavedState: SavedCrossword = { values: {}, revealed: [], expandedHints: [], complete: false }

const readSavedState = (): SavedCrossword => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySavedState
    if (raw === 'complete') return { ...emptySavedState, complete: true }
    const parsed = JSON.parse(raw) as Partial<SavedCrossword>
    return {
      values: parsed.values ?? {},
      revealed: parsed.revealed ?? [],
      expandedHints: parsed.expandedHints ?? [],
      complete: Boolean(parsed.complete),
    }
  } catch {
    return emptySavedState
  }
}

export function CrosswordSection({ onComplete }: Props) {
  const [savedState] = useState(readSavedState)
  const [values, setValues] = useState<Record<string, string>>(savedState.values)
  const [activeId, setActiveId] = useState(words[0].id)
  const [checked, setChecked] = useState(false)
  const [complete, setComplete] = useState(savedState.complete)
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set(savedState.revealed))
  const [expandedHints, setExpandedHints] = useState<Set<string>>(() => new Set(savedState.expandedHints))
  const refs = useRef<Record<string, HTMLInputElement | null>>({})

  const cells = useMemo(() => {
    const map = new Map<string, { row: number; col: number; letter: string; words: string[]; number?: number }>()
    words.forEach((word) => [...word.answer].forEach((letter, index) => {
      const row = word.row + (word.direction === 'down' ? index : 0)
      const col = word.col + (word.direction === 'across' ? index : 0)
      const key = cellKey(row, col)
      const current = map.get(key)
      if (current && current.letter !== letter) throw new Error(`Crossword conflict at ${key}`)
      map.set(key, { row, col, letter, words: [...(current?.words ?? []), word.id], number: index === 0 ? word.number : current?.number })
    }))
    return map
  }, [])

  useEffect(() => { onComplete(complete) }, [complete, onComplete])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, revealed: [...revealed], expandedHints: [...expandedHints], complete }))
  }, [complete, expandedHints, revealed, values])

  const activeWord = words.find((word) => word.id === activeId) ?? words[0]
  const wordKeys = (word: Word) => [...word.answer].map((_, index) => cellKey(word.row + (word.direction === 'down' ? index : 0), word.col + (word.direction === 'across' ? index : 0)))
  const filled = [...cells.keys()].filter((key) => values[key]).length
  const progress = Math.round((filled / cells.size) * 100)
  const activeKeys = wordKeys(activeWord)
  const revealedInWord = activeKeys.filter((key) => revealed.has(key)).length
  const activeSolved = activeKeys.every((key) => values[key] === cells.get(key)?.letter)

  const selectCell = (key: string) => {
    const cell = cells.get(key)
    if (!cell) return
    if (!cell.words.includes(activeId)) setActiveId(cell.words[0])
  }

  const change = (key: string, raw: string) => {
    const value = raw.toUpperCase().replace(/[^А-ЯЁ]/g, '').slice(-1)
    setChecked(false)
    setValues((current) => ({ ...current, [key]: value }))
    if (value) {
      const keys = wordKeys(activeWord); const index = keys.indexOf(key)
      if (index >= 0 && index < keys.length - 1) refs.current[keys[index + 1]]?.focus()
    }
  }

  const keyDown = (event: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (event.key !== 'Backspace' || values[key]) return
    const keys = wordKeys(activeWord); const index = keys.indexOf(key)
    if (index > 0) refs.current[keys[index - 1]]?.focus()
  }

  const verify = () => {
    setChecked(true)
    const solved = [...cells].every(([key, cell]) => values[key] === cell.letter)
    setComplete(solved)
    if (solved) onComplete(true)
  }

  const toggleHint = () => {
    setExpandedHints((current) => {
      const next = new Set(current)
      if (next.has(activeId)) next.delete(activeId); else next.add(activeId)
      return next
    })
  }

  const revealLetter = () => {
    const key = activeKeys.find((cell) => values[cell] !== cells.get(cell)?.letter)
    if (!key) return
    const letter = cells.get(key)?.letter
    if (!letter) return
    setChecked(false)
    setValues((current) => ({ ...current, [key]: letter }))
    setRevealed((current) => new Set(current).add(key))
    refs.current[key]?.focus()
  }

  const reset = () => {
    setValues({}); setChecked(false); setComplete(false); setRevealed(new Set()); setExpandedHints(new Set()); localStorage.removeItem(STORAGE_KEY); onComplete(false)
  }

  return (
    <section className="section crossword-section" id="crossword">
      <div className="page-shell">
        <div className="section-heading row-heading crossword-heading">
          <div><p className="section-index">04 / Код памяти</p><h2>Кроссворд:<br /><em>соберите ключ.</em></h2></div>
          <div className="crossword-intro"><AppIcon name="puzzle" size={34} /><p>Семь понятий спрятаны в маршруте проекта. Разгадайте их, чтобы открыть памятный код капсулы.</p></div>
        </div>

        <div className="crossword-layout">
          <div className="crossword-board-wrap">
            <div className="crossword-status"><span>{complete ? 'Ключ открыт' : `Заполнено ${progress}%`}</span><div><i style={{ width: `${complete ? 100 : progress}%` }} /></div></div>
            <div className="crossword-board" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                const row = Math.floor(index / GRID_SIZE) + 1; const col = index % GRID_SIZE + 1; const key = cellKey(row, col); const cell = cells.get(key)
                if (!cell) return <span className="crossword-blank" key={key} />
                const isActive = cell.words.includes(activeId)
                const isWrong = checked && values[key] !== cell.letter
                const isRevealed = revealed.has(key)
                return <label className={`crossword-cell ${isActive ? 'active' : ''} ${isWrong ? 'wrong' : ''} ${isRevealed ? 'revealed' : ''}`} key={key}>
                  {cell.number && <span>{cell.number}</span>}
                  <input ref={(node) => { refs.current[key] = node }} value={values[key] ?? ''} maxLength={1} readOnly={isRevealed} aria-label={`Клетка ${row}, ${col}${isRevealed ? ', буква открыта подсказкой' : ''}`} onFocus={() => selectCell(key)} onChange={(event) => change(key, event.target.value)} onKeyDown={(event) => keyDown(event, key)} autoComplete="off" />
                </label>
              })}
            </div>
            <div className="crossword-actions">
              <button className="button button-primary" onClick={verify}>Проверить ответы <AppIcon name="checkCircle" size={19} /></button>
              <button className="text-button" onClick={reset}>Очистить поле</button>
            </div>
          </div>

          <div className="crossword-clues">
            <div className="clue-tabs"><span>Подсказки</span><small>{words.length} слов</small></div>
            <ol>{words.map((word) => <li key={word.id} className={activeId === word.id ? 'active' : ''}>
              <button onClick={() => { setActiveId(word.id); refs.current[wordKeys(word)[0]]?.focus() }}><span>{word.number}</span><div><strong>{word.direction === 'across' ? 'По горизонтали' : 'По вертикали'}</strong><p>{word.clue}</p></div><AppIcon name="arrowRight" size={17} /></button>
            </li>)}</ol>
            {!complete && <div className="crossword-help" aria-live="polite">
              <div className="crossword-help-title"><AppIcon name="lightbulb" size={28} /><div><span>Помощь по слову № {activeWord.number}</span><strong>{activeWord.direction === 'across' ? 'По горизонтали' : 'По вертикали'} · {activeWord.answer.length} букв</strong></div></div>
              <p>{expandedHints.has(activeId) ? activeWord.hint : 'Если основной вопрос оказался сложным, откройте дополнительный намёк или одну букву в сетке.'}</p>
              {expandedHints.has(activeId) && <small>Первая буква — «{activeWord.answer[0]}». Подсказка не заполняет поле автоматически.</small>}
              <div className="crossword-help-actions">
                <button className="text-button" onClick={toggleHint}><AppIcon name="eye" size={18} />{expandedHints.has(activeId) ? 'Скрыть намёк' : 'Показать намёк'}</button>
                <button className="hint-letter-button" onClick={revealLetter} disabled={activeSolved}><AppIcon name="sparkle" size={18} />{activeSolved ? 'Слово заполнено' : 'Открыть одну букву'}</button>
              </div>
              {revealedInWord > 0 && <small className="revealed-count">Подсказкой открыто: {revealedInWord} из {activeWord.answer.length}</small>}
            </div>}
            {complete && <div className="crossword-unlocked"><AppIcon name="lockKey" size={30} /><div><span>Памятный код</span><strong>1936 — 2026</strong><p>Девять десятилетий инженерной мысли и человеческих историй.</p></div></div>}
          </div>
        </div>
      </div>
    </section>
  )
}

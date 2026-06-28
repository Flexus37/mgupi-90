import { useState } from 'react'
import { AppIcon } from './AppIcon'

const links = [
  ['#idea', 'Идея'], ['#timeline', 'История'], ['#quest', 'Маршрут'],
  ['#crossword', 'Кроссворд'], ['#message', 'Послание'], ['#gallery', 'Галерея'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <a className="brand" href="#top" aria-label="На главный экран">
        <span className="brand-mark">90</span>
        <span>МГУПИ<br /><small>капсула времени</small></span>
      </a>
      <button className="menu-button" aria-expanded={open} aria-label="Открыть меню" onClick={() => setOpen(!open)}>
        {open ? <AppIcon name="x" size={22} /> : <AppIcon name="list" size={22} />}
      </button>
      <nav className={open ? 'nav is-open' : 'nav'} aria-label="Основная навигация">
        {links.map(([href, text]) => <a key={href} href={href} onClick={() => setOpen(false)}>{text}</a>)}
      </nav>
      <a className="header-cta" href="#message">Добавить голос <AppIcon name="arrowUpRight" size={15} /></a>
    </header>
  )
}

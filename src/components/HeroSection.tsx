import { AppIcon } from './AppIcon'

export function HeroSection() {
  return (
    <section className="hero" id="top" data-report-screen="Главный экран">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content page-shell">
        <p className="eyebrow"><span /> Интерактивный проект · 1936—2026</p>
        <h1>Память,<br />которую мы<br /><em>создаём.</em></h1>
        <p className="hero-lead">Цифровая капсула времени к 90-летию МГУПИ объединяет историю, студенческие воспоминания и образ будущего технологического образования.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#idea">Начать маршрут <AppIcon name="arrowDownRight" size={18} /></a>
          <a className="button button-ghost" href="#crossword">Открыть кроссворд <AppIcon name="puzzle" size={18} /></a>
        </div>
      </div>
      <div className="hero-meta">
        <div><strong>90</strong><span>лет<br />в движении</span></div>
        <div><strong>03</strong><span>времени:<br />прошлое · настоящее · будущее</span></div>
      </div>
      <a className="scroll-cue" href="#idea"><span>Листайте, чтобы открыть</span><i><AppIcon name="arrowDownRight" size={15} /></i></a>
    </section>
  )
}

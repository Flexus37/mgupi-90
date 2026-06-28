import { AppIcon, type AppIconName } from './AppIcon'

const cards = [
  { n: '01', title: 'История', text: 'Инженерная традиция, архивные образы и ключевые этапы пути.', icon: 'archive' },
  { n: '02', title: 'Настоящее', text: 'Люди, лаборатории, проектная работа и современный визуальный язык.', icon: 'usersThree' },
  { n: '03', title: 'Будущее', text: 'Личное послание тем, кто продолжит создавать университет завтра.', icon: 'rocket' },
]

export function IdeaSection() {
  return (
    <section className="section idea-section" id="idea" data-report-screen="Идея проекта">
      <div className="page-shell">
        <div className="section-heading split-heading">
          <div><p className="section-index">01 / Идея проекта</p><h2>Не архив.<br /><em>Живой диалог.</em></h2></div>
          <p>Цифровая капсула времени — интерактивный формат, который позволяет не только рассказать об истории университета, но и вовлечь пользователя в создание личного послания. Юбилейная коммуникация становится эмоциональной, современной и понятной студентам, выпускникам и абитуриентам.</p>
        </div>
        <div className="idea-cards">
          {cards.map((card) => (
            <article className="idea-card" key={card.n}>
              <div className="card-top"><span>{card.n}</span><i><AppIcon name={card.icon as AppIconName} size={24} /></i></div>
              <h3>{card.title}</h3><p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

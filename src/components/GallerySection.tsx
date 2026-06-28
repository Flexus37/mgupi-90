import { useState } from 'react'
import { AppIcon } from './AppIcon'

const gallery = [
  { n: '01', title: 'Исторический образ', tag: 'Наследие', image: '/images/archive-lab.png', text: 'Инженерная культура, точность и совместная работа с прибором.' },
  { n: '02', title: 'Студенческая среда', tag: 'Сообщество', image: '/images/students-studio.png', text: 'Люди и проекты, из которых складывается повседневная история.' },
  { n: '03', title: 'Цифровые технологии', tag: 'Настоящее', image: '/images/technology-lab.png', text: 'Исследование, программирование и прототипирование новых решений.' },
  { n: '04', title: 'Будущее образования', tag: 'Горизонт', image: '/images/future-campus.png', text: 'Открытая среда, где технологии помогают людям учиться и создавать.' },
]

export function GallerySection() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="section gallery-section" id="gallery" data-report-screen="Визуальная галерея">
      <div className="page-shell">
        <div className="section-heading row-heading"><div><p className="section-index">06 / Визуальный архив</p><h2>Четыре образа<br /><em>одной памяти.</em></h2></div><p>Авторская визуальная серия объединяет архивную интонацию и современную технологическую эстетику. Нажмите на кадр, чтобы рассмотреть его.</p></div>
        <div className="gallery-grid">{gallery.map((item, index) => <button className={`gallery-card gallery-card-${index + 1}`} key={item.n} onClick={() => setActive(index)}><img src={item.image} alt={item.title} /><span className="gallery-tag">{item.tag}</span><div className="gallery-overlay"><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><i><AppIcon name="eye" size={21} /></i></div></button>)}</div>
      </div>
      {active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[active].title} onClick={() => setActive(null)}><button aria-label="Закрыть"><AppIcon name="x" size={25} /></button><img src={gallery[active].image} alt={gallery[active].title} /><div><span>{gallery[active].tag}</span><h3>{gallery[active].title}</h3></div></div>}
    </section>
  )
}

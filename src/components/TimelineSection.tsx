import { useState } from 'react'
import { timeline } from '../data/timeline'
import { AppIcon } from './AppIcon'

export function TimelineSection() {
  const [activeId, setActiveId] = useState(timeline[0].id)
  const active = timeline.find((item) => item.id === activeId) ?? timeline[0]
  return (
    <section className="section timeline-section" id="timeline" data-report-screen="Интерактивная временная линия">
      <div className="page-shell">
        <div className="section-heading compact-heading">
          <p className="section-index">02 / Линия времени</p>
          <h2>Шесть точек<br /><em>одного маршрута.</em></h2>
        </div>
        <div className="timeline-layout">
          <div className="timeline-nav" role="tablist" aria-label="Этапы истории">
            {timeline.map((item) => (
              <button key={item.id} role="tab" aria-selected={item.id === activeId} className={item.id === activeId ? 'timeline-tab active' : 'timeline-tab'} onClick={() => setActiveId(item.id)}>
                <span className="tab-marker">{item.marker}</span>
                <span className="tab-copy"><small>{item.period}</small><strong>{item.title}</strong></span>
                <span className="tab-arrow"><AppIcon name="arrowUpRight" size={18} /></span>
              </button>
            ))}
          </div>
          <article className="timeline-detail" key={active.id} role="tabpanel">
            <div className="timeline-photo"><img src={active.image} alt="" /><span>{active.marker} / 06</span></div>
            <p className="detail-period">{active.period}</p>
            <h3>{active.title}</h3>
            <p className="detail-summary">{active.summary}</p>
            <p className="detail-copy">{active.detail}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

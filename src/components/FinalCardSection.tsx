import type { CapsuleMessage, QuestResult } from '../types'
import { AppIcon } from './AppIcon'

type Props = { message: CapsuleMessage | null; result: QuestResult | null; crosswordComplete: boolean }

export function FinalCardSection({ message, result, crosswordComplete }: Props) {
  return (
    <section className="section final-section" id="final" data-report-screen="Финальная карточка">
      <div className="page-shell">
        <div className="final-card">
          <div className="final-lines" aria-hidden="true" /><div className="final-orbit"><span>90</span><i /><b /></div>
          <div className="final-copy"><p className="section-index">07 / Капсула создана</p><h2>Ваш голос —<br /><em>часть истории.</em></h2><p>{message ? `Послание от ${message.name} символически соединяет прошлое, настоящее и будущее университета.` : 'Создайте послание, чтобы ваш голос символически соединил прошлое, настоящее и будущее университета.'}</p><div className="final-badges">{result && <span className="final-badge"><AppIcon name="map" size={15} /> {result.code}</span>}{crosswordComplete && <span className="final-badge"><AppIcon name="puzzle" size={15} /> код разгадан</span>}</div><div className="final-actions"><a className="button button-primary" href="#message">{message ? 'Посмотреть послание' : 'Создать капсулу'} <AppIcon name="arrowUpRight" size={18} /></a><button className="button button-ghost" onClick={() => window.print()}><AppIcon name="printer" size={18} /> Печать</button></div></div>
          <div className="final-stamp"><span>MGUPI</span><strong>2026</strong><small>DIGITAL MEMORY</small></div>
        </div>
      </div>
    </section>
  )
}

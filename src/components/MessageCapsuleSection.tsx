import { useEffect, useState, type FormEvent } from 'react'
import type { CapsuleMessage } from '../types'
import { AppIcon } from './AppIcon'

const STORAGE_KEY = 'mgupi-90-message'

type Props = { message: CapsuleMessage | null; onMessage: (value: CapsuleMessage | null) => void }

export function MessageCapsuleSection({ message, onMessage }: Props) {
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) onMessage(JSON.parse(stored) as CapsuleMessage)
    } catch { localStorage.removeItem(STORAGE_KEY) }
  }, [onMessage])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value: CapsuleMessage = { name: String(data.get('name') ?? '').trim(), group: String(data.get('group') ?? '').trim(), text: String(data.get('text') ?? '').trim(), savedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); onMessage(value); setSuccess(true)
  }
  const clear = () => { localStorage.removeItem(STORAGE_KEY); onMessage(null); setSuccess(false) }
  return (
    <section className="section message-section" id="message" data-report-screen="Форма послания">
      <div className="page-shell message-layout">
        <div className="message-intro"><p className="section-index">05 / Ваш голос</p><h2>Скажите что-то<br /><em>тем, кто будет после.</em></h2><p>Оставьте короткое послание будущим студентам. Оно станет частью символической цифровой капсулы времени и сохранит личный взгляд на университет сегодня.</p><div className="privacy-note"><span><AppIcon name="shieldCheck" size={22} /></span><p><strong>Только на вашем устройстве</strong>Данные сохраняются в браузере и не отправляются на сервер.</p></div></div>
        <div className="message-form-wrap">
          {!message ? <form className="message-form" onSubmit={submit}>
            <label><span>Ваше имя</span><input name="name" required maxLength={60} placeholder="Как к вам обращаться?" /></label>
            <label><span>Направление или группа</span><input name="group" required maxLength={80} placeholder="Например: дизайн, ИТ, выпускник" /></label>
            <label><span>Послание будущим студентам</span><textarea name="text" required minLength={10} maxLength={420} placeholder="Что стоит знать, помнить или не бояться?" /><small>до 420 символов</small></label>
            <button className="button button-primary submit-button" type="submit">Сохранить в капсулу <AppIcon name="database" size={18} /></button>
          </form> : <div className="saved-message">
            <div className="saved-top"><span><AppIcon name="checkCircle" size={16} /> {success ? 'Послание сохранено' : 'Послание из вашей капсулы'}</span><i>MGUPI / 90</i></div>
            <blockquote>«{message.text}»</blockquote>
            <div className="saved-author"><div className="avatar">{message.name.slice(0, 1).toUpperCase()}</div><div><strong>{message.name}</strong><span>{message.group}</span></div></div>
            <div className="saved-actions"><a className="button button-primary" href="#final">Перейти к финалу <AppIcon name="arrowDownRight" size={17} /></a><button className="text-button danger" onClick={clear}><AppIcon name="trash" size={16} /> Удалить</button></div>
          </div>}
        </div>
      </div>
    </section>
  )
}

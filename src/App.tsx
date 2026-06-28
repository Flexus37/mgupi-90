import { useCallback, useState } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { IdeaSection } from './components/IdeaSection'
import { TimelineSection } from './components/TimelineSection'
import { QuestSection } from './components/QuestSection'
import { CrosswordSection } from './components/CrosswordSection'
import { MessageCapsuleSection } from './components/MessageCapsuleSection'
import { GallerySection } from './components/GallerySection'
import { FinalCardSection } from './components/FinalCardSection'
import { Footer } from './components/Footer'
import type { CapsuleMessage, QuestResult } from './types'

export default function App() {
  const [message, setMessage] = useState<CapsuleMessage | null>(null)
  const [result, setResult] = useState<QuestResult | null>(null)
  const [crosswordComplete, setCrosswordComplete] = useState(false)
  const updateMessage = useCallback((value: CapsuleMessage | null) => setMessage(value), [])
  return <><Header /><main><HeroSection /><IdeaSection /><TimelineSection /><QuestSection onResult={setResult} /><CrosswordSection onComplete={setCrosswordComplete} /><MessageCapsuleSection message={message} onMessage={updateMessage} /><GallerySection /><FinalCardSection message={message} result={result} crosswordComplete={crosswordComplete} /></main><Footer /></>
}

import type { Question } from '../types'
import { QuestionImage } from './QuestionImage'
import { SceneView } from './SceneView'

/** Ілюстрація питання: схема ситуації або зображення (знак) */
export function QuestionMedia({ question }: { question: Question }) {
  if (question.scene) return <SceneView scene={question.scene} />
  if (question.image) return <QuestionImage src={question.image} />
  return null
}

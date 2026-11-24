// AI assistance: Codex helped draft the door dialog and activity handling.
import { useId, useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import DoorStatusIcon from '../atoms/DoorStatusIcon'
import GiftCard from './GiftCard'
import product11 from '../../assets/guess-day-11.png'
import product16 from '../../assets/guess-day-16.png'
import type { CalendarDoor } from '../../types/calendar'

const illustrations = import.meta.glob('../../assets/hc-andersen-img/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
})

interface DoorProps {
    door: CalendarDoor
    locked: boolean
    opened: boolean
    isToday: boolean
    onOpen: () => void
}

interface AnswerOptionsProps {
    name: string
    question: string
    options: string[]
}

function AnswerOptions({ name, question, options }: AnswerOptionsProps) {
    return (
        <fieldset>
            <legend>{question}</legend>
            {options.map((option, index) => (
                <div key={index}>
                    <label>
                        <input type="radio" name={name} value={index} required />
                        {option}
                    </label>
                </div>
            ))}
        </fieldset>
    )
}

function normalizeAnswer(answer: string) {
    return answer.normalize('NFC').trim().toLocaleLowerCase('da-DK').replace(/[.!?]+$/, '').trim()
}

export default function Door({ door, locked, opened, isToday, onOpen }: DoorProps) {
    const dialog = useRef<HTMLDialogElement>(null)
    const openButton = useRef<HTMLButtonElement>(null)
    const titleId = useId()
    const formId = useId()
    const form = useRef<HTMLFormElement>(null)
    const [feedback, setFeedback] = useState('')

    function checkAnswer(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const answers = new FormData(event.currentTarget)
        const answer = answers.get('answer')
        if (typeof answer !== 'string') return

        if (door.kind === 'riddle') {
            const correct = door.answers.some(option => normalizeAnswer(option) === normalizeAnswer(answer))
            setFeedback(correct ? 'Rigtigt svar!' : 'Prøv igen.')
        } else if (door.kind === 'quiz') {
            setFeedback(Number(answer) === door.answer ? 'Rigtigt svar!' : 'Prøv igen.')
        } else if (door.kind === 'choice') {
            const index = Number(answer)
            const firstResult = door.feedback?.[index] ?? `Dit valg: ${door.options[index]}.`
            const followUpAnswer = answers.get('followUp')
            const secondResult = typeof followUpAnswer === 'string'
                ? door.followUp?.feedback?.[Number(followUpAnswer)]
                : undefined
            setFeedback(secondResult ? `${firstResult} ${secondResult}` : firstResult)
        }
    }

    function saveTip() {
        try {
            localStorage.setItem(`ringsted-dun-tip-2026-${door.day}`, door.text)
            setFeedback('Tippet er gemt i denne browser.')
        } catch {
            setFeedback('Tippet kunne ikke gemmes.')
        }
    }

    function resetDoor() {
        form.current?.reset()
        setFeedback('')
        openButton.current?.focus()
    }

    if (locked) {
        return (
            <div className="door-tile door-tile--locked">
                <span className="door-tile__number">{door.day}</span>
                <span className="door-tile__status-icon"><DoorStatusIcon kind="locked" /></span>
                <span className="visually-hidden">Låst</span>
            </div>
        )
    }

    const status = opened ? 'Åbnet' : isToday ? 'Åben i dag' : 'Kan åbnes'
    const appearance = opened ? 'opened' : isToday ? 'today' : 'available'
    const prefix = '/dag-' + String(door.day).padStart(2, '0') + '-'
    const image = Object.entries(illustrations).find(([path]) => path.includes(prefix))?.[1]
    const product = door.day === 11 ? product11 : door.day === 16 ? product16 : undefined

    return (
        <>
            <button
                ref={openButton}
                className={`door-tile door-tile--${appearance}`}
                type="button"
                aria-haspopup="dialog"
                aria-label={`Låge ${door.day}. ${door.title}. ${status}`}
                onClick={() => {
                    dialog.current?.showModal()
                    onOpen()
                }}
            >
                <span className="door-tile__number">{door.day}</span>
                <span className="door-tile__status-icon">
                    <DoorStatusIcon kind={appearance === 'today' ? 'gift' : 'unlocked'} />
                </span>
            </button>

            <dialog
                className="door-dialog"
                ref={dialog}
                aria-labelledby={titleId}
                onClose={resetDoor}
            >
                <div className="door-dialog__layout">
                    {typeof image === 'string' && (
                        <img className="door-dialog__art" src={image} alt="" />
                    )}
                    <div className="door-dialog__content">
                        <p>Låge {door.day} · {door.day}. december</p>
                        <h2 id={titleId}>{door.title}</h2>
                        <h3>{door.heading}</h3>
                        {product && <img className="door-dialog__product" src={product}
                            alt="Nærbillede af stoffet på det produkt, du skal gætte" />}
                        {door.kind === 'story' ? (
                            <p>{door.text}</p>
                        ) : (
                            <form id={formId} ref={form} onSubmit={checkAnswer} onChange={() => setFeedback('')}>
                                {door.kind === 'riddle' ? (
                                    <label>
                                        {door.text}
                                        <input
                                            type="text"
                                            name="answer"
                                            placeholder={door.placeholder}
                                            required
                                        />
                                    </label>
                                ) : (
                                    <AnswerOptions name="answer" question={door.text} options={door.options} />
                                )}

                                {door.kind === 'choice' && door.followUp && (
                                    <AnswerOptions
                                        name="followUp"
                                        question={door.followUp.text}
                                        options={door.followUp.options}
                                    />
                                )}

                            </form>
                        )}
                        <p className="door-dialog__feedback" role="status">{feedback}</p>
                        <GiftCard gift={door.gift} />
                        <div className="door-dialog__actions">
                            {door.kind === 'story' ? (
                                <button type="button" onClick={saveTip}>{door.actions.primary}</button>
                            ) : (
                                <button type="submit" form={formId}>{door.actions.primary}</button>
                            )}
                            <button className="door-dialog__secondary" type="button" disabled>
                                {door.actions.secondary}
                            </button>
                            <button className="door-dialog__close" type="button" onClick={() => dialog.current?.close()}>
                                {door.actions.close}
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    )
}
// AI assistance: Codex helped draft the door dialog and activity handling.
import { useId, useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import type { CalendarDoor } from '../../types/calendar'

interface DoorProps {
    door: CalendarDoor
    locked: boolean
    opened: boolean
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

export default function Door({ door, locked, opened, onOpen }: DoorProps) {
    const dialog = useRef<HTMLDialogElement>(null)
    const openButton = useRef<HTMLButtonElement>(null)
    const titleId = useId()
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
        return <span>{door.title} · Låst</span>
    }

    const status = opened ? 'Åbnet' : 'Kan åbnes'

    return (
        <>
            <button
                ref={openButton}
                type="button"
                aria-haspopup="dialog"
                aria-label={`Låge ${door.day}. ${door.title}. ${status}`}
                onClick={() => {
                    dialog.current?.showModal()
                    onOpen()
                }}
            >
                {door.title} · {status}
            </button>

            <dialog
                ref={dialog}
                aria-labelledby={titleId}
                onClose={resetDoor}
            >
                <p>Låge {door.day} · {door.day}. december</p>
                <h2 id={titleId}>{door.title}</h2>
                <h3>{door.heading}</h3>
                {door.kind === 'story' ? (
                    <>
                        <p>{door.text}</p>
                        <button type="button" onClick={saveTip}>{door.actions.primary}</button>
                    </>
                ) : (
                    <form ref={form} onSubmit={checkAnswer} onChange={() => setFeedback('')}>
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

                        <button type="submit">{door.actions.primary}</button>
                    </form>
                )}
                <p role="status">{feedback}</p>
                <button type="button" onClick={() => dialog.current?.close()}>
                    {door.actions.close}
                </button>
            </dialog>
        </>
    )
}
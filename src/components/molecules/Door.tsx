// AI assistance: Codex helped draft the door dialog and quiz feedback.
import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { CalendarDoor } from '../../types/calendar'

interface DoorProps {
    door: CalendarDoor
    locked: boolean
    opened: boolean
    onOpen: () => void
}

export default function Door({ door, locked, opened, onOpen }: DoorProps) {
    const dialog = useRef<HTMLDialogElement>(null)
    const openButton = useRef<HTMLButtonElement>(null)
    const titleId = useId()
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [feedback, setFeedback] = useState('')

    function checkQuizAnswer(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (door.kind !== 'quiz' || selectedIndex === null) return

        setFeedback(selectedIndex === door.answer ? 'Rigtigt svar!' : 'Prøv igen.')
    }

    function resetDoor() {
        setSelectedIndex(null)
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
                {door.kind === 'quiz' ? (
                    <form onSubmit={checkQuizAnswer}>
                        <fieldset>
                            <legend>{door.text}</legend>
                            {door.options.map((option, index) => (
                                <div key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={index}
                                            checked={selectedIndex === index}
                                            onChange={() => {
                                                setSelectedIndex(index)
                                                setFeedback('')
                                            }}
                                            required
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </fieldset>
                        <button type="submit">{door.actions.primary}</button>
                        <p role="status">{feedback}</p>
                    </form>
                ) : (
                    <p>{door.text}</p>
                )}
                <button type="button" onClick={() => dialog.current?.close()}>
                    {door.actions.close}
                </button>
            </dialog>
        </>
    )
}
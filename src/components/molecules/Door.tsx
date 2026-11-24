// AI assistance: Codex helped draft the door component and dialog behavior.
import { useId, useRef } from 'react'
import type { CalendarDoor } from '../../types/calendar'

interface DoorProps {
    door: CalendarDoor
}

export default function Door({ door }: DoorProps) {
    const dialog = useRef<HTMLDialogElement>(null)
    const openButton = useRef<HTMLButtonElement>(null)
    const titleId = useId()

    return (
        <>
            <button
                ref={openButton}
                type="button"
                aria-haspopup="dialog"
                aria-label={`Låge ${door.day}. ${door.title}`}
                onClick={() => dialog.current?.showModal()}
            >
                {door.title}
            </button>

            <dialog
                ref={dialog}
                aria-labelledby={titleId}
                onClose={() => openButton.current?.focus()}
            >
                <p>Låge {door.day} · {door.day}. december</p>
                <h2 id={titleId}>{door.title}</h2>
                <h3>{door.heading}</h3>
                <p>{door.text}</p>
                <button type="button" onClick={() => dialog.current?.close()}>
                    {door.actions.close}
                </button>
            </dialog>
        </>
    )
}
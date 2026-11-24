// AI assistance: Codex helped draft the gift card and copy-code behavior.
import { useState } from 'react'
import type { Gift } from '../../types/calendar'

interface GiftCardProps {
    gift: Gift
    actionLabel: string
}

export default function GiftCard({ gift, actionLabel }: GiftCardProps) {
    const [message, setMessage] = useState('')
    const code = gift.code

    async function copyCode(code: string) {
        try {
            await navigator.clipboard.writeText(code)
            setMessage('Rabatkoden er kopieret.')
        } catch {
            setMessage('Koden kunne ikke kopieres automatisk. Du kan markere og kopiere den her.')
        }
    }

    return (
        <section className="gift-card" aria-label="Dagens gave">
            <p>Dagens gave</p>
            <p><strong>{gift.title}</strong></p>

            {code && (
                <>
                    <p>Rabatkode <code>{code}</code></p>
                    <button type="button" onClick={() => void copyCode(code)}>
                        {actionLabel}
                    </button>
                    <p role="status">{message}</p>
                </>
            )}
        </section>
    )
}
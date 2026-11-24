// AI assistance: Codex helped draft the gift card and copy-code behavior.
import type { Gift } from '../../types/calendar'

interface GiftCardProps {
    gift: Gift
}

export default function GiftCard({ gift }: GiftCardProps) {
    return (
        <section className="gift-card" aria-label="Dagens gave">
            <p>Dagens gave</p>
            <p><strong>{gift.title}</strong></p>
            {gift.code && <p>Rabatkode <code>{gift.code}</code></p>}
        </section>
    )
}
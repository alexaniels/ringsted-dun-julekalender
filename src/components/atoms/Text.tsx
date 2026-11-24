// AI assistance: Codex helped drafting.
import type { ReactNode } from 'react'

type TextProps = {
    children: ReactNode
}

export default function Text({ children }: TextProps) {
    return <p className="text">{children}</p>
}
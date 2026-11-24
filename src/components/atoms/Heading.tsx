// AI assistance: Codex helped drafting.
import type { ReactNode } from 'react'

type HeadingProps = {
    level?: 1 | 2 | 3
    children: ReactNode
}

export default function Heading({ level = 2, children }: HeadingProps) {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
    return <Tag className={`heading heading--${level}`}>{children}</Tag>
}
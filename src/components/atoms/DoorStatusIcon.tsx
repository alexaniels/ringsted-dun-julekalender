// AI assistance: Codex helped create the reusable door status icons and hide decorative SVGs from screen readers.
// Vi har forholdt os kritisk til Codex's output og bedt om dybere forståelse af elementerne og deres funktion.

type DoorIconKind = 'locked' | 'unlocked' | 'gift'

export default function DoorStatusIcon({ kind }: { kind: DoorIconKind }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {kind === 'gift' ? (
                <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H8a2.5 2.5 0 1 1 2.3-3.5L12 8Zm0 0h4a2.5 2.5 0 1 0-2.3-3.5L12 8Z" />
            ) : (
                <>
                    <rect x="5" y="10" width="14" height="11" rx="3" />
                    {kind === 'locked' ? (
                        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                    ) : (
                        <path d="M8 10V7a4 4 0 0 1 7.8-1" />
                    )}
                </>
            )}
        </svg>
    )
}
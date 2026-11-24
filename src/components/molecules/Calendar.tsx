// AI assistance: Codex helped draft the React data loading and list rendering.
import { useEffect, useState } from 'react'
import { loadDoors } from '../../api/loadDoors'
import type { CalendarDoor } from '../../types/calendar'

export default function Calendar() {
    const [doors, setDoors] = useState<CalendarDoor[]>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        let active = true

        loadDoors()
            .then(loadedDoors => {
                if (active) setDoors(loadedDoors)
            })
            .catch(() => {
                if (active) setError(true)
            })

        // Ignore an unfinished request after this component is removed.
        return () => {
            active = false
        }
    }, [])

    return (
        <section aria-labelledby="calendar-heading">
            <h2 id="calendar-heading">Julekalenderens låger</h2>

            {error && <p role="alert">Lågerne kunne ikke indlæses.</p>}

            {!error && doors.length === 0 && (
                <p role="status">Indlæser lågerne…</p>
            )}

            {doors.length > 0 && (
                <ol>
                    {doors.map(door => (
                        <li key={door.day} value={door.day}>{door.title}</li>
                    ))}
                </ol>
            )}
        </section>
    )
}
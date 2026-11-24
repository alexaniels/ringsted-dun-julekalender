// AI assistance: Codex helped draft the React data loading, date locking and saved progress.
import { useEffect, useState } from 'react'
import { loadDoors } from '../../api/loadDoors'
import type { CalendarDoor } from '../../types/calendar'
import { getCalendarDay, readOpenedDoors, saveOpenedDoors } from '../../utils/calendarProgress'
import Door from './Door'

export default function Calendar() {
    const [doors, setDoors] = useState<CalendarDoor[]>([])
    const [error, setError] = useState(false)
    const [today, setToday] = useState(() => getCalendarDay())
    const [opened, setOpened] = useState(readOpenedDoors)
    const [storageError, setStorageError] = useState(false)

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

    useEffect(() => {
        const timer = window.setInterval(() => setToday(getCalendarDay()), 15_000)
        return () => window.clearInterval(timer)
    }, [])

    function markOpened(day: number) {
        if (opened.includes(day)) return

        const nextOpened = [...opened, day]
        setOpened(nextOpened)
        setStorageError(!saveOpenedDoors(nextOpened))
    }

    return (
        <section aria-labelledby="calendar-heading">
            <h2 id="calendar-heading">Julekalenderens låger</h2>

            {error && <p role="alert">Lågerne kunne ikke indlæses.</p>}

            {!error && doors.length === 0 && (
                <p role="status">Indlæser lågerne…</p>
            )}

            {doors.length > 0 && (
                <>
                    <p role="status">{opened.length} af {doors.length} låger åbnet</p>
                    {today === 0 && <p>Den første låge åbner 1. december.</p>}
                    {storageError && (
                        <p role="status">Din fremgang kunne ikke gemmes i browseren.</p>
                    )}

                    <ol>
                        {doors.map(door => (
                            <li key={door.day} value={door.day}>
                                <Door
                                    door={door}
                                    locked={door.day > today}
                                    opened={opened.includes(door.day)}
                                    onOpen={() => markOpened(door.day)}
                                />
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </section>
    )
}
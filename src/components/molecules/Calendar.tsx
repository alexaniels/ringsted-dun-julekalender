// AI assistance: Codex helped draft the React data loading, date locking and saved progress.
// Vi har forholdt os kritisk til Codex's output og bedt om dybere forståelse af elementerne og deres funktion.

import { useEffect, useState } from 'react'
import { loadDoors } from '../../api/loadDoors'
import type { CalendarDoor } from '../../types/calendar'
import { getCalendarDay, readOpenedDoors, saveOpenedDoors } from '../../utils/calendarProgress'
import Door from './Door'
import DoorStatusIcon from '../atoms/DoorStatusIcon'

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
        <section className="calendar" aria-labelledby="calendar-heading">
            <h2 className="visually-hidden" id="calendar-heading" tabIndex={-1}>Julekalenderens låger</h2>

            {error && <p role="alert">Lågerne kunne ikke indlæses.</p>}

            {!error && doors.length === 0 && (
                <p role="status">Indlæser lågerne…</p>
            )}

            {doors.length > 0 && (
                <>
                    <p className="visually-hidden" role="status">{opened.length} af {doors.length} låger åbnet</p>
                    {today === 0 && <p className="visually-hidden">Den første låge åbner 1. december.</p>}
                    {storageError && (
                        <p role="status">Din fremgang kunne ikke gemmes i browseren.</p>
                    )}

                    <ol className="door-grid" role="list">
                        {doors.map(door => (
                            <li key={door.day} value={door.day}>
                                <Door
                                    door={door}
                                    locked={door.day > today}
                                    isToday={door.day === today}
                                    opened={opened.includes(door.day)}
                                    onOpen={() => markOpened(door.day)}
                                />
                            </li>
                        ))}
                    </ol>

                    <ul className="door-legend" role="list" aria-label="Forklaring af lågeikoner">
                        <li><DoorStatusIcon kind="locked" /> Låst</li>
                        <li><DoorStatusIcon kind="unlocked" /> Åbnet</li>
                        <li><DoorStatusIcon kind="gift" /> Åben i dag</li>
                    </ul>
                </>
            )}
        </section>
    )
}
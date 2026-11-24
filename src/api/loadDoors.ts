// AI assistance: Codex helped draft the JSON loading and error handling.
import type { CalendarDoor } from '../types/calendar'

export async function loadDoors(): Promise<CalendarDoor[]> {
    // Vite serves the contents of public/ at the app's base URL.
    const response = await fetch(import.meta.env.BASE_URL + 'data/doors.json')

    if (!response.ok) {
        throw new Error(`Kunne ikke hente lågerne (HTTP ${response.status}).`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data) || data.length !== 24) {
        throw new Error('doors.json skal indeholde en liste med 24 låger.')
    }

    // The check above verifies the list length. The assertion supplies the
    // field types from calendar.ts for our own JSON file.
    return data as CalendarDoor[]
}
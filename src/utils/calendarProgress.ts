// AI assistance: Codex helped draft the date and saved-progress rules.
export const YEAR = 2026
const storageKey = `ringsted-dun-opened-${YEAR}`

//export function getCalendarDay(date = new Date()): number {
export function getCalendarDay(date = new Date('2026-12-25T12:00:00+01:00')): number { // brugt til at teste kalenderen
    const parts = new Intl.DateTimeFormat('da-DK', {
        timeZone: 'Europe/Copenhagen',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }).formatToParts(date)

    const year = Number(parts.find(part => part.type === 'year')?.value)
    const month = Number(parts.find(part => part.type === 'month')?.value)
    const day = Number(parts.find(part => part.type === 'day')?.value)

    if (year < YEAR || (year === YEAR && month < 12)) return 0
    if (year > YEAR || day > 24) return 25
    return day
}

export function readOpenedDoors(): number[] {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
        if (Array.isArray(saved)) {
            return [...new Set(saved.filter(day => Number.isInteger(day) && day >= 1 && day <= 24))]
        }
    } catch {
        // Missing access or invalid saved JSON should not stop the calendar.
    }
    return []
}

export function saveOpenedDoors(opened: number[]): boolean {
    try {
        localStorage.setItem(storageKey, JSON.stringify(opened))
        return true
    } catch {
        return false
    }
}
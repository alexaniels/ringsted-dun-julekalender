// Codex er blevet brugt her og har forklaret og vejledt os i at implememtere koderne til calendar.ts, så det hænger sammen med doors.json
// Vi har forholdt os kritisk til Codex's output og bedt om dybere forståelse af elementerne og deres funktion.

export interface Gift {
    title: string
    code?: string
}

export interface DoorActions {
    primary: string
    secondary: string
    close: string
}

// Every door has these fields, regardless of its activity.
interface BaseDoor {
    day: number
    title: string
    category: string
    heading: string
    text: string
    gift: Gift
    actions: DoorActions
}

export interface QuizDoor extends BaseDoor {
    kind: 'quiz'
    options: string[]
    // Zero-based position of the correct option.
    answer: number
}

export interface FollowUpQuestion {
    text: string
    options: string[]
    feedback?: string[]
}

export interface ChoiceDoor extends BaseDoor {
    kind: 'choice'
    options: string[]
    // Each feedback entry matches the option at the same position.
    feedback?: string[]
    followUp?: FollowUpQuestion
}

export interface StoryDoor extends BaseDoor {
    kind: 'story'
}

export interface RiddleDoor extends BaseDoor {
    kind: 'riddle'
    answers: string[]
    placeholder?: string
}

// Checking kind tells TypeScript which activity fields are available.
export type CalendarDoor = QuizDoor | ChoiceDoor | StoryDoor | RiddleDoor

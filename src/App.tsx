// Codex har hjulpet med implememtere vores header design til kalenderen.
import Header from './components/organisms/Header'
import Calendar from './components/molecules/Calendar'
import artwork from './assets/hca-papirklip-forside-img.svg'

export default function App() {
    return (
        <>
            <a className="skip-link" href="#calendar-heading">Gå til kalenderen</a>
            <Header />
            <main>
                <div className="calendar-hero">
                    <img src={artwork} alt="" />
                </div>
                <div className="calendar-intro">
                    <p>Velkommen til Ringsted Duns julekalender 2026</p>
                    <p>Åben en låge hver dag fra 1. til 24. december</p>
                    <p>Du kan deltage i quizzer, få rabatkoder, få gode råd til en bedre nats søvn og andre spændende ting.</p>
                </div>
                <Calendar />
            </main>
        </>
    )
}
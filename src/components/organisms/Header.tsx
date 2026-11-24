// AI assistance: Codex helped draft the header from the Figma mockup.
import logo from '../../assets/ringsted-dun-logo.svg'

export default function Header() {
    return (
        <header className="header">
            <img
                className="header__logo"
                src={logo}
                alt="Ringsted Dun"
            />
            <h1 className="header__title">Julekalender</h1>
        </header>
    )
}
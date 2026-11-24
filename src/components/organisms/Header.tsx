import Button from "../atoms/Button";

type HeaderProps = {
  title?: string;
  onOpenToday?: () => void;
};

export default function Header({
  title = "Ringsted Dun Julekalender",
  onOpenToday,
}: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      <Button onClick={onOpenToday}>Åbn dagens låge</Button>
    </header>
  );
}
import Button from "../atoms/Button";

type CalendarProps = {
  onSelectDay?: (day: number) => void;
};

// Sæt til true, mens du tester, så alle låger kan åbnes
const UNLOCK_ALL = true;

export default function Calendar({ onSelectDay }: CalendarProps) {
  const days = Array.from({ length: 24 }, (_, i) => i + 1);
  const today = new Date();
  const isDecember = today.getMonth() === 11;
  const currentDay = today.getDate();

  return (
    <div className="calendar">
      {days.map((day) => {
        const isOpenable = UNLOCK_ALL || (isDecember && day <= currentDay);
        return (
          <Button
            key={day}
            variant={isOpenable ? "primary" : "secondary"}
            disabled={!isOpenable}
            onClick={() => onSelectDay?.(day)}
          >
            {day}
          </Button>
        );
      })}
    </div>
  );
}
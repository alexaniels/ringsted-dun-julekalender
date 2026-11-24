// AI assistance: Codex helped drafting.
type DoorNumberProps = {
  day: number;
};

export default function DoorNumber({ day }: DoorNumberProps) {
  return <span className="door__number">{day}</span>;
}
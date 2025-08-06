interface Props {
  title: string;
  onClick: () => void;
}

export default function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}

import Image from 'next/image';

export type EmptyDisplayProps = {
  title: string;
  description: string;
};

export function EmptyDisplay({ title, description }: EmptyDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <Image src="/images/empty-box.png" alt="Empty Box" width={180} height={180} />
      <div>
        <div className="text-center font-bold text-xl mt-4 text-accent-foreground">{title}</div>
        <div className="text-center text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

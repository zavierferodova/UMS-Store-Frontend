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
        <div className="text-accent-foreground mt-4 text-center text-xl font-bold">{title}</div>
        <div className="text-muted-foreground text-center">{description}</div>
      </div>
    </div>
  );
}

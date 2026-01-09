'use client';
import { cn } from '@/lib/utils';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export type NotFoundDisplayProps = {
  message?: string;
  className?: string;
};

export function NotFoundDisplay({ message, className }: NotFoundDisplayProps) {
  return (
    <div className={cn(`flex h-full w-full flex-col items-center justify-center`, className)}>
      <div className="w-4/5 lg:w-2/3">
        <DotLottieReact src="/lottie/under-construction.lottie" loop autoplay />
      </div>
      <div className="text-center text-3xl font-medium text-zinc-700">
        {message || 'Eitss gak nemu nih!'}
      </div>
    </div>
  );
}

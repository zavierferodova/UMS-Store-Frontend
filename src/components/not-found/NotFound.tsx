'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export type NotFoundProps = {
  message?: string;
};

export function NotFound({ message }: NotFoundProps) {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="w-4xl">
        <DotLottieReact src="/lottie/Y8za7rMi03.lottie" loop autoplay />
      </div>
      <div className="text-3xl font-medium text-zinc-700 text-center">
        {message || 'Eitss gak nemu nih ?'}
      </div>
    </div>
  );
}

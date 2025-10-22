import { RefreshCw } from 'lucide-react';

export function SpinAnimation() {
  return (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="h-6 w-6 animate-spin" />
    </div>
  );
}

import { NotFound } from '@/components/not-found/NotFound';

export type PanelNotFoundProps = {
  message?: string;
};

export function PanelNotFound({ message }: PanelNotFoundProps) {
  return (
    <div className="h-[80dvh]">
      <NotFound message={message} />
    </div>
  );
}

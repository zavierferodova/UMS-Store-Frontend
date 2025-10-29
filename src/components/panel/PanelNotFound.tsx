import { NotFoundDisplay } from '@/components/display/NotFoundDisplay';

export type PanelNotFoundProps = {
  message?: string;
};

export function PanelNotFound({ message }: PanelNotFoundProps) {
  return (
    <div className="h-[80dvh]">
      <NotFoundDisplay message={message} />
    </div>
  );
}

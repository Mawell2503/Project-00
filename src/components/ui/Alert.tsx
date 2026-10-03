import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

const styles = {
  error: 'bg-rose-500/10 border-rose-500/25 text-rose-300',
  success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
};

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
};

const iconColors = {
  error: 'text-rose-500',
  success: 'text-emerald-500',
};

export default function Alert({ type, message }: AlertProps) {
  const Icon = icons[type];
  return (
    <div className={`p-3 border rounded-xl text-xs flex gap-2 items-start ${styles[type]}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColors[type]}`} />
      <span>{message}</span>
    </div>
  );
}

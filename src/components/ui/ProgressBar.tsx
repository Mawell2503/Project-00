interface ProgressBarProps {
  value: number;
  color?: 'orange' | 'emerald' | 'rose';
  size?: 'sm' | 'md';
}

const colorMap = {
  orange: 'bg-orange-600',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2',
};

export default function ProgressBar({ value, color = 'orange', size = 'sm' }: ProgressBarProps) {
  return (
    <div className={`${sizeMap[size]} bg-white/10 rounded-full overflow-hidden`}>
      <div
        className={`h-full ${colorMap[color]} rounded-full transition-all`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

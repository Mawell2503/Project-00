import { type LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  large?: boolean;
}

export default function NavButton({ icon: Icon, label, isActive, onClick, large }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
        isActive
          ? 'bg-orange-500/15 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon className={large ? 'w-6 h-6' : 'w-5 h-5'} />
      <span className="text-[9px] font-bold">{label}</span>
    </button>
  );
}

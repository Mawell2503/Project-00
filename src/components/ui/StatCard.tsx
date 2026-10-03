interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="glass-card p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-orange-400/80 font-semibold">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}

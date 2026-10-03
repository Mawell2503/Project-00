interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextInput({ label, className = '', ...props }: TextInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <input
        className={`glass-input ${className}`}
        {...props}
      />
    </div>
  );
}

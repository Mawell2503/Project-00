interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <textarea
        className={`glass-input resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

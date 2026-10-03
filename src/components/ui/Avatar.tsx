interface AvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  imageUrl?: string;
}

const sizeMap = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-3xl',
};

export default function Avatar({ username, size = 'sm', className = '', imageUrl }: AvatarProps) {
  return (
    <div className={`${sizeMap[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-full text-white font-extrabold flex items-center justify-center uppercase shrink-0 overflow-hidden shadow-[0_4px_16px_rgba(249,115,22,0.35)] ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={username} className="h-full w-full object-cover" />
      ) : (
        username[0].toUpperCase()
      )}
    </div>
  );
}

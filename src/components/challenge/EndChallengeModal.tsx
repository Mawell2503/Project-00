import { useState, useRef } from 'react';
import { Trophy, Camera, X } from 'lucide-react';
import type { Challenge } from '../../types';
import Textarea from '../ui/Textarea';

interface EndChallengeModalProps {
  isOpen: boolean;
  challenge: Challenge | null;
  onClose: () => void;
  onSubmit: (message: string, mediaUrl?: string) => Promise<void>;
}

export default function EndChallengeModal({ isOpen, challenge, onClose, onSubmit }: EndChallengeModalProps) {
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !challenge) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Write a quick accountability message.');
      return;
    }

    setLoading(true);
    try {
      let mediaUrl: string | undefined;
      if (mediaFile) {
        const formData = new FormData();
        formData.append('video', mediaFile);
        const uploadRes = await fetch('/api/upload/lobby-video', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          mediaUrl = uploadData.url;
        }
      }
      await onSubmit(message.trim(), mediaUrl);
      setMessage('');
      removeMedia();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit proof.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setMessage('');
    removeMedia();
    onClose();
  };

  const daysCompleted = challenge.duration_days;
  const endText = daysCompleted === 1 ? '1 day' : `${daysCompleted} days`;

  return (
    <div className="modal-backdrop">
      <div className="modal-shell">

        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.06))' }}>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" /> Challenge Complete!
          </h3>
          <button onClick={handleSkip} className="modal-close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="text-center">
            <h4 className="text-base font-bold text-white">{challenge.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{endText} &bull; {challenge.reward_xp} XP earned</p>
          </div>

          <Textarea
            label="Accountability Box"
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Share your win — what you accomplished, what you learned..."
            className="h-24"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Proof (optional)</label>
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-white/[0.12]">
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreview} className="w-full h-32 object-cover" controls />
                ) : (
                  <img src={mediaPreview} alt="Proof" className="w-full h-32 object-cover" />
                )}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 border-2 border-dashed border-white/[0.15] rounded-xl text-slate-400 hover:border-orange-500/40 hover:text-orange-400 transition-colors flex flex-col items-center gap-2 cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-semibold">Upload Photo or Video</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={handleSkip} className="btn-secondary flex-1 py-2.5">
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm flex items-center justify-center"
            >
              {loading ? 'Submitting...' : 'Submit Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

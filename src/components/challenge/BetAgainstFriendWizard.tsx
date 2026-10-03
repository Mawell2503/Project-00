import { useState } from 'react';
import { ChevronLeft, Camera, MapPin } from 'lucide-react';
import type { CreateFriendBetForm, ConfirmationMethod, FriendProfile } from '../../types';
import FriendPicker from './FriendPicker';
import TextInput from '../ui/TextInput';
import Textarea from '../ui/Textarea';

interface BetAgainstFriendWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: CreateFriendBetForm) => Promise<void>;
}

const STEPS = ['Friend', 'Title', 'Details', 'Stake', 'Tracking'];
const TOTAL_STEPS = STEPS.length;

export default function BetAgainstFriendWizard({ isOpen, onClose, onSubmit }: BetAgainstFriendWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedFriend, setSelectedFriend] = useState<FriendProfile | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stakeDescription, setStakeDescription] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState<ConfirmationMethod>('photo_video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canNext = () => {
    if (step === 0) return !!selectedFriend;
    if (step === 1) return title.trim().length > 0;
    if (step === 2) return description.trim().length > 0;
    if (step === 3) return stakeDescription.trim().length > 0;
    if (step === 4) return true;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setError(null);
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setError(null);
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFriend) return;
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        stake_description: stakeDescription.trim(),
        confirmation_method: confirmationMethod,
        friend_id: selectedFriend.id,
        friend_username: selectedFriend.username,
      });
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create bet.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setSelectedFriend(null);
    setTitle('');
    setDescription('');
    setStakeDescription('');
    setConfirmationMethod('photo_video');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-shell" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>

        <div className="modal-header">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button onClick={handleBack} className="text-white hover:opacity-70">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h3 className="font-bold text-white text-lg">Bet Against a Friend</h3>
          </div>
          <button onClick={handleClose} className="modal-close-btn">&times;</button>
        </div>

        <div className="px-5 py-3 flex items-center justify-center gap-2 shrink-0">
          {STEPS.map((s, i) => (
            <div key={s} className={`w-2 h-2 rounded-full transition-all ${
              i < step ? 'bg-orange-500' : i === step ? 'bg-orange-500 scale-125' : 'bg-white/[0.12]'
            }`} />
          ))}
        </div>

        <div className="px-5 pb-4 flex-1 overflow-y-auto">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
            Step {step + 1} of {TOTAL_STEPS}: {STEPS[step]}
          </p>

          {step === 0 && (
            <FriendPicker
              selectedFriendId={selectedFriend?.id || null}
              onSelect={setSelectedFriend}
            />
          )}

          {step === 1 && (
            <TextInput
              label="Title the bet"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Morning Run Challenge"
            />
          )}

          {step === 2 && (
            <Textarea
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's the challenge about?"
              className="h-28"
            />
          )}

          {step === 3 && (
            <TextInput
              label="What's at stake?"
              type="text"
              value={stakeDescription}
              onChange={e => setStakeDescription(e.target.value)}
              placeholder="e.g. Loser buys dinner"
            />
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-medium">How will you keep track?</p>
              <button
                type="button"
                onClick={() => setConfirmationMethod('photo_video')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  confirmationMethod === 'photo_video'
                    ? 'border-orange-500/70 bg-orange-500/10'
                    : 'border-white/[0.12] hover:border-white/[0.2] bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Camera className={`w-5 h-5 ${confirmationMethod === 'photo_video' ? 'text-orange-400' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">Photo / Video</p>
                    <p className="text-[10px] text-slate-400">Both parties upload proof at the agreed time.</p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setConfirmationMethod('location')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  confirmationMethod === 'location'
                    ? 'border-orange-500/70 bg-orange-500/10'
                    : 'border-white/[0.12] hover:border-white/[0.2] bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`w-5 h-5 ${confirmationMethod === 'location' ? 'text-orange-400' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">Location Check-in</p>
                    <p className="text-[10px] text-slate-400">App verifies you're at the target location (GPS).</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 font-medium mt-2">{error}</p>}
        </div>

        <div className="px-5 py-3 border-t border-white/[0.08] shrink-0">
          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : `Challenge ${selectedFriend?.username || 'Friend'}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
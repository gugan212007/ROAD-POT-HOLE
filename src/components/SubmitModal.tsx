import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';

const SubmitModal = () => {
  const { modal, closeModal, submitReport, gps, captureGps } = useApp();
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!modal) return null;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await submitReport(desc, gps, photo);
    setLoading(false);
    setDesc('');
    setPhoto(null);
    setPreview(null);
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-[10px] z-[500] flex items-center sm:items-center justify-center p-3 sm:p-6 animate-fade-up"
      onClick={e => e.target === e.currentTarget && closeModal()}
    >
      <div className="w-full max-w-[520px] rounded-[18px] sm:rounded-[18px] overflow-hidden animate-modal-in max-h-[90vh] overflow-y-auto bg-card shadow-card-xl">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #7c4dba, #c2537a)' }}>
          <span className="text-[17px] font-bold text-white">📍 Report Road Damage</span>
          <button onClick={closeModal} className="w-[30px] h-[30px] rounded-lg bg-white/[0.18] border border-white/25 flex items-center justify-center text-white/85 hover:bg-white/[0.28] hover:text-white transition-all text-[17px]">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {/* Photo */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">📷 Photo Evidence</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-accent/25 rounded-lg p-7 text-center cursor-pointer bg-accent/[0.03] hover:border-accent hover:bg-accent/10 transition-all"
            >
              <span className="text-[32px] block mb-2">📸</span>
              <div className="text-sm font-semibold text-muted-foreground">Drop photo here or click to browse</div>
              <div className="text-xs text-muted-foreground/70 mt-1">JPG, PNG · up to 10MB</div>
              {preview && (
                <img src={preview} className="w-full h-[110px] object-cover rounded-md border border-border mt-3" alt="Preview" />
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* GPS */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">📍 GPS Location</label>
            {gps ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-status-resolved-bg text-status-resolved-fg text-xs font-semibold border border-status-resolved-bd font-mono-code">
                ✓ {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}
              </div>
            ) : (
              <button onClick={captureGps} className="px-3.5 py-1.5 rounded-xs border border-border bg-transparent text-muted-foreground text-[13px] font-semibold hover:bg-secondary transition-colors">
                ⊙ Capture Current Location
              </button>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">
              📝 Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe size, severity, road name, hazard level…"
              className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-border bg-secondary/50 text-sm outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/10 resize-y min-h-[86px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3.5 flex gap-2.5 justify-end border-t border-border">
          <button onClick={closeModal} className="px-4 py-2 rounded-[10px] border border-border text-muted-foreground text-[13px] font-semibold hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white border border-white/10 transition-all hover:-translate-y-px disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
            ) : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;

import { useState, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

const SubmitModal = () => {
  const { modal, closeModal, submitReport, gps, captureGps } = useApp();
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!modal) return null;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      // Wait for next render to attach video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPhoto(file);
        setPreview(URL.createObjectURL(blob));
      }
      stopCamera();
    }, 'image/jpeg', 0.92);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    await submitReport(desc, gps, photo);
    setLoading(false);
    setDesc('');
    setPhoto(null);
    setPreview(null);
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-[10px] z-[500] flex items-center sm:items-center justify-center p-3 sm:p-6 animate-fade-up"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-[520px] rounded-[18px] sm:rounded-[18px] overflow-hidden animate-modal-in max-h-[90vh] overflow-y-auto bg-card shadow-card-xl">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #7c4dba, #c2537a)' }}>
          <span className="text-[17px] font-bold text-white">📍 Report Road Damage</span>
          <button onClick={handleClose} className="w-[30px] h-[30px] rounded-lg bg-white/[0.18] border border-white/25 flex items-center justify-center text-white/85 hover:bg-white/[0.28] hover:text-white transition-all text-[17px]">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {/* Photo */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">📷 Photo Evidence</label>

            {/* Camera view */}
            {cameraOpen && (
              <div className="relative rounded-xl overflow-hidden border-2 border-accent/30 mb-3" style={{ background: '#000' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                  <button
                    onClick={capturePhoto}
                    className="w-[56px] h-[56px] rounded-full border-[3px] border-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7c4dba, #c2537a)', boxShadow: '0 4px 20px rgba(124,77,186,0.5)' }}
                  >
                    <span className="text-white text-xl">📸</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/90 bg-white/[0.15] border border-white/20 hover:bg-white/[0.25] transition-all"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Preview of captured/uploaded photo */}
            {preview && !cameraOpen && (
              <div className="relative rounded-xl overflow-hidden border border-border mb-3">
                <img src={preview} className="w-full h-[160px] object-cover" alt="Preview" />
                <button
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white text-sm hover:bg-black/80 transition-all"
                >
                  ✕
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                  ✓ Photo attached
                </div>
              </div>
            )}

            {/* Upload / Camera buttons (shown when no preview and camera is closed) */}
            {!preview && !cameraOpen && (
              <div className="grid grid-cols-2 gap-3">
                {/* Browse files */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-accent/25 rounded-xl p-5 text-center cursor-pointer bg-accent/[0.03] hover:border-accent hover:bg-accent/10 transition-all"
                >
                  <span className="text-[28px] block mb-1.5">📁</span>
                  <div className="text-[12px] font-semibold text-muted-foreground">Browse Files</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5">JPG, PNG · up to 10MB</div>
                </div>

                {/* Capture from camera */}
                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-accent/25 rounded-xl p-5 text-center cursor-pointer bg-accent/[0.03] hover:border-[#7c4dba] hover:bg-[#7c4dba]/10 transition-all"
                >
                  <span className="text-[28px] block mb-1.5">📷</span>
                  <div className="text-[12px] font-semibold text-muted-foreground">Live Camera</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5">Capture from device</div>
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <canvas ref={canvasRef} className="hidden" />
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
          <button onClick={handleClose} className="px-4 py-2 rounded-[10px] border border-border text-muted-foreground text-[13px] font-semibold hover:bg-secondary transition-colors">
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

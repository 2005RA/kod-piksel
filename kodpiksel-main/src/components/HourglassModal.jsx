// src/components/HourglassModal.jsx
// Shared across RaceWorkspace.
// Props: { open, onConfirm, onCancel, hourglass (seconds per hourglass = 30) }

export default function HourglassModal({ open, onConfirm, onCancel, seconds = 30 }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">⏳</div>
        <div className="modal-title">Qum saatı istifadə et?</div>
        <div className="modal-body">
          Bu, taymera <strong>+{seconds} saniyə</strong> əlavə edəcək.
          Bu əməliyyatı geri ala bilməzsiniz.
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>Ləğv et</button>
          <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>İstifadə et ✓</button>
        </div>
      </div>
    </div>
  );
}
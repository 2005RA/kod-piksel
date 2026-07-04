// src/components/ChestModal.jsx
// Shared across RaceWorkspace and LessonPage (future).
// Props: { open, chest: { cost, hint, code }, keys (current count), onConfirm, onCancel }

export default function ChestModal({ open, chest, keys, onConfirm, onCancel }) {
  if (!open || !chest) return null;
  const canAfford = keys >= chest.cost;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🗝️</div>
        <div className="modal-title">Sandığı aç?</div>
        <div className="modal-body">
          Bu sandıq <strong>{chest.cost} açar</strong> tələb edir.
          Hal-hazırda sende <strong>{keys} açar</strong> var.
          {!canAfford && (
            <div className="modal-warning">⚠ Kifayət qədər açarın yoxdur!</div>
          )}
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>Ləğv et</button>
          <button
            className="modal-btn modal-btn--confirm"
            onClick={onConfirm}
            disabled={!canAfford}
          >
            Aç 🗝️ ×{chest.cost}
          </button>
        </div>
      </div>
    </div>
  );
}
// src/pages/QaralamalarPage.jsx
import { useNotebook } from '../context/NotebookContext';

export default function QaralamalarPage({ isDraggable = true }) {
  const { highlights } = useNotebook();

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="nb-page-content">
      <div className="nb-page-heading">📌 Qaralamalar</div>
      <div className="nb-page-sub">Seçdiyiniz hissələri qeyd vərəqlərinə sürükləyib buraxın (Drag & Drop).</div>

      {highlights.length === 0 ? (
        <div className="nb-empty">Hələ heç nə seçilməyib.<br/>Dərs oxuyarkən əsas cümlələri markerlə işarələyin!</div>
      ) : (
        <div className="nb-highlights-list">
          {highlights.map(h => (
            <div 
              key={h.id} 
              className="nb-highlight-item"
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, h.text)}
              style={{ cursor: isDraggable ? 'grab' : 'default' }}
            >
              <div className="nb-highlight-bar" style={{ background: h.color }} />
              <div className="nb-highlight-body">
                <div 
                  className="nb-highlight-text" 
                  style={{ background: h.color + '18', borderLeft: `3px solid ${h.color}` }}
                >
                  {h.text}
                </div>
                <div className="nb-highlight-source">Sürüşdürün ➔ {h.source}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useNotebook } from '../context/NotebookContext';

export default function HighlightableText({ children, sourceTitle }) {
  const { isMarkerActive, addHighlight } = useNotebook();

  const handleMouseUp = () => {
    // Only capture if the marker tool is actively switched on
    if (!isMarkerActive) return;

    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText && selectedText.trim().length > 0) {
      addHighlight(selectedText, sourceTitle);
      
      // Clear selection cursor highlight after capturing so it doesn't linger ugly
      selection.removeAllRanges();
    }
  };

  return (
    <div 
      className={`highlightable-container ${isMarkerActive ? 'marker-cursor-active' : ''}`}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
}
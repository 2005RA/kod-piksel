import { createContext, useContext, useState, useEffect } from 'react';
// 1. Paste imports at the top
import { supabase } from '../lib/supabase';
import { loadHighlights, saveHighlight, deleteHighlight } from '../lib/supabaseNotebook';

const NotebookContext = createContext();

export function NotebookProvider({ children }) {
  // 2. Keep your existing marker and color states
  const [isMarkerActive, setIsMarkerActive] = useState(false);
  const [markerColor, setMarkerColor] = useState('#00D4AA');
  
  // 3. Keep highlights state (initialized empty as it will load from Supabase)
  const [user, setUser] = useState(null);
  const [highlights, setHighlights] = useState([]);

  // 4. Get current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  // 5. Load highlights from Supabase when user is available
  useEffect(() => {
    if (!user) return;
    loadHighlights(user.id).then(setHighlights).catch(console.error);
  }, [user]);

  // 6. Keep your original event listener so LessonPage communication doesn't break!
  // Modified to handle the Supabase save logic asynchronously
  useEffect(() => {
    const handler = async (e) => {
      const { text, color, source } = e.detail ?? {};
      if (!text?.trim()) return;

      const chosenColor = color || markerColor || '#00D4AA';
      const chosenSource = source || 'Seçilmiş mətn';
      const optimisticId = Date.now();

      // Optimistic state update
      const optimistic = { id: optimisticId, text: text.trim(), source: chosenSource, color: chosenColor };
      setHighlights(prev => [optimistic, ...prev]);

      // Save to Supabase
      if (user) {
        try {
          const saved = await saveHighlight(user.id, { text: text.trim(), source: chosenSource, color: chosenColor });
          setHighlights(prev => prev.map(h => h.id === optimisticId ? saved : h));
        } catch (error) {
          console.error("Failed to save highlight via listener:", error);
        }
      }
    };
    
    window.addEventListener('kodpiksel:highlight', handler);
    return () => window.removeEventListener('kodpiksel:highlight', handler);
  }, [user, markerColor]); // Re-bind if user or fallback markerColor changes

  // 7. Your updated async addHighlight function
  const addHighlight = async (text, source) => {
    
    if (!text?.trim()) return;
    const chosenSource = source || 'Seçilmiş Mətn';
    const optimistic = { id: Date.now(), text: text.trim(), source: chosenSource, color: markerColor };
    
    setHighlights(prev => [optimistic, ...prev]); // optimistic update

    if (user) {
      try {
        console.log('saving highlight, user:', user?.id);

        const saved = await saveHighlight(user.id, { text: text.trim(), source: chosenSource, color: markerColor });
        console.log('saved:', saved);

        // replace optimistic entry with real DB row (has real uuid)
        setHighlights(prev => prev.map(h => h.id === optimistic.id ? saved : h));
      } catch (error) {
        console.error("Failed to save highlight:", error);
        
      }
    }
    
  };

  // 8. Your new removeHighlight function
  const removeHighlight = async (id) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    if (user) await deleteHighlight(id).catch(console.error);
  };

  return (
    <NotebookContext.Provider value={{
      isMarkerActive, setIsMarkerActive,
      markerColor, setMarkerColor,
      highlights, setHighlights, 
      addHighlight, removeHighlight, // 9. Added removeHighlight to the context value
    }}>
      {children}
    </NotebookContext.Provider>
  );
}

export const useNotebook = () => useContext(NotebookContext);
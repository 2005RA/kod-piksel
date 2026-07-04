import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotebook } from '../context/NotebookContext';
import { supabase } from '../lib/supabase';
import { loadNotebookFiles, upsertNotebookFile, deleteNotebookFile } from '../lib/supabaseNotebook';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INITIAL_FILES = {
  'index.html': {
    drawings: [],
    nodes: [{ id: 1, type: 'sticker', val: '🚀', x: 260, y: 80 }],
  },
  'notes.txt': {
    drawings: [],
    nodes: [{ id: 2, type: 'text', val: 'Bu qeyd notes.txt faylına məxsusdur!', x: 40, y: 60 }],
  },
};

const STICKERS = ['⚡', '🔥', '👾', '🚀', '⭐', '💡', '🎯', '🏆'];

// IDs of snippets that started in the sidebar (used to restore on erase)
const INITIAL_SNIPPETS = [
  { id: 'snip-1', val: 'Dövr operatorları təkrarlanan kod bloklarını icra edir...', src: 'python_baslangic.py' },
  { id: 'snip-2', val: 'Flexbox elementləri bir ölçülü sətir üzrə düzür.', src: 'css_layout.cfg' },
];

// ─── DRAWING CANVAS ───────────────────────────────────────────────────────────

function DrawingCanvas({ activeFile, fileDb, onSaveStrokes, currentTool }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const last      = useRef({ x: 0, y: 0 });
  const ctxRef    = useRef(null);

 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const resize = () => {
    const parent = canvas.parentElement;
    const w = Math.round(parent.clientWidth);
    const h = Math.round(parent.clientHeight);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
      redrawAll(canvas, fileDb[activeFile]?.drawings ?? []);
    }
  };

  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  return () => ro.disconnect();
}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawAll(canvas, fileDb[activeFile]?.drawings ?? []);
  }, [activeFile, fileDb]);

  function redrawAll(canvas, drawings) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let i = 0;
    while (i < drawings.length) {
      const seg = drawings[i];

      if (seg.tool === 'marker') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth   = 14;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        let prevX2 = null, prevY2 = null;
        ctx.beginPath();
        while (i < drawings.length && drawings[i].tool === 'marker') {
          const s = drawings[i];
          if (prevX2 === null || s.x1 !== prevX2 || s.y1 !== prevY2) {
            ctx.moveTo(s.x1, s.y1);
          }
          ctx.lineTo(s.x2, s.y2);
          prevX2 = s.x2;
          prevY2 = s.y2;
          i++;
        }
        ctx.stroke();
        ctx.restore();

      } else if (seg.tool === 'eraser') {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.arc(seg.x1, seg.y1, seg.r ?? 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        i++;

      } else {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth   = 2;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
        ctx.restore();
        i++;
      }
    }
  }

  const getXY = (e) => ({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

  const onMouseDown = (e) => {
    if (currentTool === 'select') return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctxRef.current = ctx;
    isDrawing.current = true;
    const { x, y } = getXY(e);
    last.current = { x, y };

    if (currentTool === 'pen') {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#00d4aa';
      ctx.lineWidth   = 2;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (currentTool === 'marker') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth   = 14;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const onMouseMove = (e) => {
    if (!isDrawing.current) return;
    const { x, y } = getXY(e);
    const ctx = ctxRef.current;

    if (currentTool === 'eraser') {
      ctx.clearRect(x - 14, y - 14, 28, 28);
      onSaveStrokes({ x1: x, y1: y, x2: x, y2: y, tool: 'eraser', r: 14 });
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      onSaveStrokes({ x1: last.current.x, y1: last.current.y, x2: x, y2: y, tool: currentTool });
    }
    last.current = { x, y };
  };

  const onMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentTool === 'pen' || currentTool === 'marker') {
      ctxRef.current?.restore();
    }
  };

  const isActive = currentTool !== 'select';

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: isActive ? 20 : 2,
        cursor:
          currentTool === 'eraser'  ? 'cell'      :
          currentTool === 'select'  ? 'default'   : 'crosshair',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    />
  );
}

// ─── DOM NODES LAYER ──────────────────────────────────────────────────────────

function DomNodesLayer({ nodes, onMoveNode, onDeleteNode, currentTool }) {
  const boardRef = useRef(null);

  const startDrag = (e, idx) => {
    e.stopPropagation();
    const board  = boardRef.current;
    const rect   = board.getBoundingClientRect();
    const elRect = e.currentTarget.getBoundingClientRect();
    const shiftX = e.clientX - elRect.left;
    const shiftY = e.clientY - elRect.top;

    const onMove = (ev) => {
      let tx = ev.clientX - rect.left - shiftX;
      let ty = ev.clientY - rect.top  - shiftY;
      tx = Math.max(0, Math.min(tx, rect.width  - 40));
      ty = Math.max(0, Math.min(ty, rect.height - 40));
      onMoveNode(idx, tx, ty);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  };

  return (
    <div
      ref={boardRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {nodes.map((node, idx) => (
        <div
          key={node.id}
          data-nodeid={node.id}
          onMouseDown={e => startDrag(e, idx)}
          style={{
            position: 'absolute',
            left: node.x, top: node.y,
            pointerEvents: 'auto',
            cursor: 'grab',
            userSelect: 'none',
            zIndex: currentTool === 'select' ? 25 : 5,
            ...(node.type === 'sticker'
              ? { fontSize: '2.5rem', padding: 0, lineHeight: 1 }
              : {
                  background: 'rgba(17,24,39,0.95)',
                  border: '1px solid #f59e0b',
                  color: '#ffedd5',
                  fontSize: '0.78rem',
                  maxWidth: 220,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                  padding: '6px 12px',
                  paddingRight: 28,
                }),
          }}
        >
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDeleteNode(idx); }}
            style={{
              position: 'absolute', top: node.type === 'sticker' ? -8 : 3, right: node.type === 'sticker' ? -8 : 4,
              background: 'rgba(20,20,30,0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              color: '#f45050',
              fontSize: '0.6rem',
              width: 16, height: 16,
              lineHeight: '14px', textAlign: 'center',
              cursor: 'pointer', padding: 0,
              opacity: 0,
              transition: 'opacity 0.15s',
              zIndex: 30,
            }}
            className="node-delete-btn"
          >✕</button>

          {node.type === 'sticker'
            ? node.val
            : (
              <>
                {node.val}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem', color: '#64748b',
                  display: 'block', marginTop: 4,
                }}>↳ sinxron qeyd</span>
              </>
            )
          }
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function FileManager({ onClose }) {
  const { highlights, setHighlights, removeHighlight } = useNotebook();

  const [fileDb, setFileDb]         = useState(() => JSON.parse(JSON.stringify(INITIAL_FILES)));
  const [fileList, setFileList]     = useState(['index.html', 'notes.txt']);
  const [openTabs, setOpenTabs]     = useState(['index.html', 'notes.txt']);
  const [activeFile, setActiveFile] = useState('index.html');
  const [currentTool, setCurrentTool] = useState('pen');
  const [user, setUser] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  useEffect(() => {
    if (!user) return;
    loadNotebookFiles(user.id).then(dbFiles => {
      if (Object.keys(dbFiles).length > 0) {
        setFileDb(dbFiles);
        const names = Object.keys(dbFiles);
        setFileList(names);
        setOpenTabs(names);
        if (!names.includes(activeFile)) {
          setActiveFile(names[0] || '');
        }
      }
    }).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user || !activeFile) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const file = fileDb[activeFile];
      if (file) {
        upsertNotebookFile(user.id, activeFile, file).catch(console.error);
      }
    }, 1500);
    
    return () => clearTimeout(saveTimer.current);
  }, [fileDb, activeFile, user]);

  const contextSnippets = highlights.map(h => ({
    id:  `hl-${h.id}`,
    val: h.text,
    src: h.source || 'Dərs',
  }));

  const [manualSnippets, setManualSnippets] = useState(INITIAL_SNIPPETS);
  const snippets = [...contextSnippets, ...manualSnippets];
  const [placedSnipIds, setPlacedSnipIds] = useState(new Set());

  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName]   = useState('');
  const [newFileError, setNewFileError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const saveStroke = useCallback((line) => {
    setFileDb(prev => ({
      ...prev,
      [activeFile]: {
        ...prev[activeFile],
        drawings: [...(prev[activeFile]?.drawings ?? []), line],
      },
    }));
  }, [activeFile]);

  const moveNode = useCallback((idx, x, y) => {
    setFileDb(prev => {
      const nodes = [...(prev[activeFile]?.nodes ?? [])];
      nodes[idx] = { ...nodes[idx], x, y };
      return { ...prev, [activeFile]: { ...prev[activeFile], nodes } };
    });
  }, [activeFile]);

  const deleteNode = useCallback((idx) => {
    setFileDb(prev => {
      const nodes = [...(prev[activeFile]?.nodes ?? [])];
      const removed = nodes[idx];
      if (removed?.snippetId) {
        setPlacedSnipIds(prev2 => {
          const next = new Set(prev2);
          next.delete(removed.snippetId);
          return next;
        });
      }
      nodes.splice(idx, 1);
      return { ...prev, [activeFile]: { ...prev[activeFile], nodes } };
    });
  }, [activeFile]);

  const onDrop = (e) => {
    e.preventDefault();
    const type      = e.dataTransfer.getData('fm_type');
    const val       = e.dataTransfer.getData('fm_val');
    const snippetId = e.dataTransfer.getData('fm_snippetId') || null;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top  - 20;

    const newNode = { id: Date.now(), type, val, x, y, snippetId };
    setFileDb(prev => ({
      ...prev,
      [activeFile]: {
        ...prev[activeFile],
        nodes: [...(prev[activeFile]?.nodes ?? []), newNode],
      },
    }));

    if (snippetId) {
      setPlacedSnipIds(prev => new Set([...prev, snippetId]));
    }
  };

  const clearCanvas = () => {
    const nodes = fileDb[activeFile]?.nodes ?? [];
    const toRestore = nodes.filter(n => n.snippetId).map(n => n.snippetId);
    if (toRestore.length) {
      setPlacedSnipIds(prev => {
        const next = new Set(prev);
        toRestore.forEach(id => next.delete(id));
        return next;
      });
    }
    setFileDb(prev => ({ ...prev, [activeFile]: { drawings: [], nodes: [] } }));
  };

  const openNewFileModal = () => {
    setNewFileName('');
    setNewFileError('');
    setShowNewFileModal(true);
  };

  const closeNewFileModal = () => setShowNewFileModal(false);

  const confirmNewFile = () => {
    const name = newFileName.trim();
    if (!name) { setNewFileError('Fayl adı boş ola bilməz.'); return; }
    if (fileDb[name]) { setNewFileError('Bu adda fayl artıq mövcuddur!'); return; }
    setFileDb(prev => ({ ...prev, [name]: { drawings: [], nodes: [] } }));
    setFileList(prev => [...prev, name]);
    setOpenTabs(prev => [...prev, name]);
    setActiveFile(name);
    setShowNewFileModal(false);
  };

  const closeTab = (e, name) => {
    e.stopPropagation();
    const next = openTabs.filter(t => t !== name);
    setOpenTabs(next);
    if (activeFile === name) {
      setActiveFile(next[next.length - 1] ?? fileList.find(f => f !== name) ?? '');
    }
  };

  const deleteFile = (e, name) => {
    e.stopPropagation();
    setDeleteTarget(name);
  };

  const confirmDeleteFile = () => {
    const name = deleteTarget;
    setDeleteTarget(null);
    const nodes = fileDb[name]?.nodes ?? [];
    
    const rescued = nodes
      .filter(n => n.type === 'text')
      .map(n => ({ id: `rescued-${Date.now()}-${Math.random()}`, val: n.val, src: name }));
    if (rescued.length) setManualSnippets(prev => [...prev, ...rescued]);

    if (user) {
      deleteNotebookFile(user.id, name).catch(console.error);
    }

    setFileDb(prev => { const next = { ...prev }; delete next[name]; return next; });
    setFileList(prev => prev.filter(f => f !== name));
    setOpenTabs(prev => {
      const next = prev.filter(t => t !== name);
      if (activeFile === name) setActiveFile(next[0] ?? '');
      return next;
    });
  };

  // replace removeSnippet (lines 479-486)
const removeSnippet = (id) => {
  if (id.startsWith('hl-')) {
    const rawId = id.replace('hl-', ''); // keep as string — it's a UUID
    removeHighlight(rawId);              // handles both state + Supabase delete
  } else {
    setManualSnippets(prev => prev.filter(s => s.id !== id));
  }
};

  const nodes = fileDb[activeFile]?.nodes ?? [];

  // ─── STYLES ──────────────────────────────────────────────────────────────────
  const S = {
    container: {
      width: '100%', maxWidth: 1600,
      display: 'grid', gridTemplateColumns: '290px 1fr',
      background: 'var(--navy2)',
      border: '2px solid var(--border-teal)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 4px 4px 0 var(--teal)',
      minHeight: 'calc(100vh - 110px)',
    },
    treePanel: {
      background: 'rgba(11,15,25,0.5)',
      borderRight: '1px solid var(--border-teal)',
      padding: 20,
      display: 'flex', flexDirection: 'column', gap: 20,
      overflowY: 'auto',
    },
    treeHeader: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.65rem', textTransform: 'uppercase',
      letterSpacing: 2, color: 'var(--muted)', marginBottom: 8,
    },
    folderGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
    sidebarRow: (active) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: active ? 'rgba(0,212,170,0.08)' : 'transparent',
      borderRadius: 4, marginLeft: 14,
      padding: '4px 6px 4px 10px',
      cursor: 'pointer', transition: 'all 0.2s',
    }),
    sidebarName: (active) => ({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      color: active ? 'var(--teal)' : 'var(--muted)',
      flex: 1,
    }),
    iconBtn: {
      background: 'none', border: 'none',
      color: 'var(--muted)', cursor: 'pointer',
      fontSize: '0.7rem', padding: '0 2px',
      lineHeight: 1, opacity: 0.6,
      transition: 'opacity 0.15s',
    },
    snippetRow: {
      display: 'flex', alignItems: 'flex-start', gap: 6,
      marginLeft: 14,
    },
    fileItemText: {
      flex: 1,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderLeft: '3px solid var(--yellow)',
      padding: '8px 12px', fontSize: '0.75rem',
      cursor: 'grab', transition: 'all 0.2s',
    },
    fileSrcTag: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.58rem', color: 'var(--muted)',
      display: 'block', marginTop: 4,
    },
    stickerVault: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 6, marginLeft: 14,
      background: 'rgba(0,0,0,0.2)', padding: 8,
      border: '1px dashed var(--border-teal)',
    },
    stickerAsset: {
      fontSize: '1.4rem', textAlign: 'center',
      cursor: 'grab', padding: 4,
      background: 'none', border: 'none',
      transition: 'transform 0.15s',
    },
    workspaceView: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    tabsBar: {
      background: 'var(--navy)',
      display: 'flex', borderBottom: '1px solid var(--border-teal)',
      flexWrap: 'wrap',
    },
    tab: (active) => ({
      padding: '10px 14px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.73rem',
      color: active ? 'var(--teal)' : 'var(--muted)',
      background: active ? 'var(--navy2)' : 'rgba(0,0,0,0.1)',
      borderRight: '1px solid rgba(0,212,170,0.15)',
      borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
tab: (active) => ({
  padding: '10px 14px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.73rem',
  color: active ? 'var(--teal)' : 'var(--muted)',
  background: active ? 'var(--navy2)' : 'rgba(0,0,0,0.1)',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: '1px solid rgba(0,212,170,0.15)',
  borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}),    }),
    tabClose: {
      background: 'none', border: 'none',
      color: 'var(--muted)', cursor: 'pointer',
      fontSize: '0.75rem', padding: '0 2px',
      lineHeight: 1, opacity: 0.5,
      transition: 'opacity 0.15s',
    },
    addTabBtn: {
      color: 'var(--teal)', fontWeight: 'bold',
      background: 'transparent', border: 'none',
      padding: '0 16px', cursor: 'pointer',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.85rem',
    },
    toolbar: {
      display: 'flex', gap: 8, flexWrap: 'wrap',
      background: 'var(--navy2)', padding: '10px 20px',
      borderBottom: '1px dashed var(--border-teal)',
      alignItems: 'center',
    },
    toolBtn: (active) => ({
      background: active ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? 'var(--teal)' : 'rgba(255,255,255,0.1)'}`,
      color: active ? 'var(--teal)' : 'var(--white)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.72rem', padding: '6px 12px', cursor: 'pointer',
    }),
    clearBtn: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'var(--pink)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.72rem', padding: '6px 12px', cursor: 'pointer',
    },
    canvasWrapper: {
      position: 'relative', flexGrow: 1, minHeight: 300,
    },
    gridBoard: {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: '#0e131f',
      backgroundImage: `
        linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      zIndex: 1,
    },
    emptyWorkspace: {
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--muted)',
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
    },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5,8,15,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    },
    modalCard: {
      width: 360,
      background: 'var(--navy2)',
      border: '2px solid var(--border-teal)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 4px 4px 0 var(--teal)',
      padding: 24,
    },
    modalTitle: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8rem', textTransform: 'uppercase',
      letterSpacing: 2, color: 'var(--teal)', marginBottom: 16,
    },
    modalInput: {
      width: '100%', boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-teal)',
      color: 'var(--white)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8rem', padding: '10px 12px',
      outline: 'none',
    },
    modalError: {
      color: 'var(--pink)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.7rem', marginTop: 8,
    },
    modalActions: {
      display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20,
    },
    modalCancelBtn: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'var(--muted)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.72rem', padding: '8px 14px', cursor: 'pointer',
    },
    modalConfirmBtn: {
      background: 'rgba(0,212,170,0.1)',
      border: '1px solid var(--teal)',
      color: 'var(--teal)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.72rem', padding: '8px 14px', cursor: 'pointer',
    },
  };

  const TOOLS = [
    { id: 'select', label: '↖ Seç' },
    { id: 'pen',    label: '✏️ Qələm' },
    { id: 'marker', label: '🖍️ Marker' },
    { id: 'eraser', label: '◻ Silgi' },
  ];

  return (
    <div className="nb-wrapper">
      <div style={S.container}>

        {/* ─── SIDEBAR ─── */}
        <div style={S.treePanel}>
          <div>
            <div style={S.treeHeader}>📁 fayllar/</div>
            <div style={S.folderGroup}>
              {fileList.map(name => (
                <div
                  key={name}
                  style={S.sidebarRow(activeFile === name)}
                  onClick={() => {
                    if (!openTabs.includes(name)) setOpenTabs(prev => [...prev, name]);
                    setActiveFile(name);
                  }}
                >
                  <span style={S.sidebarName(activeFile === name)}>📄 {name}</span>
                  <button
                    style={S.iconBtn}
                    title="Faylı sil"
                    onClick={e => deleteFile(e, name)}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                  >🗑</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={S.treeHeader}>📥 sinxron qaralamalar/</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {snippets
                .filter(s => !placedSnipIds.has(s.id))
                .map(snip => (
                  <div key={snip.id} style={S.snippetRow}>
                    <div
                      style={S.fileItemText}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('fm_type', 'text');
                        e.dataTransfer.setData('fm_val',  snip.val);
                        e.dataTransfer.setData('fm_snippetId', snip.id);
                      }}
                    >
                      "{snip.val.slice(0, 42)}…"
                      {snip.src && <span style={S.fileSrcTag}>↳ {snip.src}</span>}
                    </div>
                    <button
                      style={{ ...S.iconBtn, alignSelf: 'center', fontSize: '0.8rem' }}
                      title="Qeydlərdən sil"
                      onClick={() => removeSnippet(snip.id)}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >✕</button>
                  </div>
                ))
              }
              {snippets.filter(s => !placedSnipIds.has(s.id)).length === 0 && (
                <div style={{
                  marginLeft: 14, fontSize: '0.68rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--muted)', opacity: 0.5,
                }}>— boşdur —</div>
              )}
            </div>
          </div>

          <div>
            <div style={S.treeHeader}>🎁 qazanılan etiketlər/</div>
            <div style={S.stickerVault}>
              {STICKERS.map(emoji => (
                <button
                  key={emoji}
                  style={S.stickerAsset}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('fm_type', 'sticker');
                    e.dataTransfer.setData('fm_val',  emoji);
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── WORKSPACE ─── */}
        <div style={S.workspaceView}>
          <div style={S.tabsBar}>
            {openTabs.map(name => (
              <button
                key={name}
                style={S.tab(activeFile === name)}
                onClick={() => setActiveFile(name)}
              >
                📄 {name}
                <span
                  style={S.tabClose}
                  onClick={e => closeTab(e, name)}
                  title="Bağla"
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                >✕</span>
              </button>
            ))}
            <button style={S.addTabBtn} onClick={openNewFileModal}>+ yeni fayl</button>
          </div>

          {activeFile && fileDb[activeFile] ? (
            <>
              <div style={S.toolbar}>
                {TOOLS.map(t => (
                  <button
                    key={t.id}
                    style={S.toolBtn(currentTool === t.id)}
                    onClick={() => setCurrentTool(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
                <button style={S.clearBtn} onClick={clearCanvas}>❌ Lövhəni Təmizlə</button>
              </div>

              <div
                style={S.canvasWrapper}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
              >
                <div style={S.gridBoard} />

                <DrawingCanvas
                  key={activeFile}
                  activeFile={activeFile}
                  fileDb={fileDb}
                  onSaveStrokes={saveStroke}
                  currentTool={currentTool}
                />

                <DomNodesLayer
                  nodes={nodes}
                  onMoveNode={moveNode}
                  onDeleteNode={deleteNode}
                  currentTool={currentTool}
                />
              </div>
            </>
          ) : (
            <div style={S.emptyWorkspace}>
              Sol paneldən bir fayl seçin
            </div>
          )}
        </div>

      </div>

      {showNewFileModal && (
        <div style={S.modalOverlay} onClick={closeNewFileModal}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>📄 Yeni fayl</div>
            <input
              autoFocus
              style={S.modalInput}
              placeholder="isci_vereq.py"
              value={newFileName}
              onChange={e => { setNewFileName(e.target.value); setNewFileError(''); }}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmNewFile();
                if (e.key === 'Escape') closeNewFileModal();
              }}
            />
            {newFileError && <div style={S.modalError}>{newFileError}</div>}
            <div style={S.modalActions}>
              <button style={S.modalCancelBtn} onClick={closeNewFileModal}>İmtina</button>
              <button style={S.modalConfirmBtn} onClick={confirmNewFile}>Yarat</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={S.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>🗑 Faylı sil</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 16,
            }}>
              <span style={{ color: 'var(--teal)' }}>"{deleteTarget}"</span> faylı tamamilə silinsin?<br/>
              <span style={{ color: 'var(--pink)', fontSize: '0.7rem' }}>Bu əməliyyat geri alına bilməz.</span>
            </div>
            <div style={S.modalActions}>
              <button style={S.modalCancelBtn} onClick={() => setDeleteTarget(null)}>İmtina</button>
              <button style={{ ...S.modalConfirmBtn, borderColor: 'var(--pink)', color: 'var(--pink)' }}
                onClick={confirmDeleteFile}>Sil</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [data-nodeid]:hover .node-delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
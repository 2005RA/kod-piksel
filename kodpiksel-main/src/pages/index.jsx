// src/pages/Notebook/index.jsx
import { useState } from 'react';
import NotebookBook from './NotebookBook';

export default function Notebook() {
  const [open, setOpen] = useState(false);

  return (
    <div className="nb-wrapper">
      <NotebookBook/>
    </div>
  );
}
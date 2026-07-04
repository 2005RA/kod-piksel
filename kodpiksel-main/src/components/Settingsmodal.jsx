// src/components/SettingsModal.jsx
import { useState } from 'react';

function Toggle({ id, checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="toggle-track" />
    </label>
  );
}

export default function SettingsModal({ open, onClose }) {
  const [settings, setSettings] = useState({
    notifRace:   true,
    notifCourse: true,
    notifSys:    false,
    rain:        true,
    typewriter:  true,
  });

  function set(key, val) {
    setSettings(prev => ({ ...prev, [key]: val }));
    // Future: fire side effects here (e.g. toggle rain canvas)
  }

  if (!open) return null;

  return (
    <div id="settings-modal" className="open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="settings-card">
        <button className="settings-close" onClick={onClose}>✕</button>
        <div className="settings-title">// Ayarlar</div>

        {/* Notifications */}
        <div className="settings-group">
          <div className="settings-group-label">Bildirişlər</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Yarış xatırlatmaları</div>
              <div className="settings-row-sub">Yarış başlamazdan 5 dəqiqə əvvəl</div>
            </div>
            <Toggle id="set-notif-race" checked={settings.notifRace} onChange={v => set('notifRace', v)} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Yeni kurs bildirişi</div>
              <div className="settings-row-sub">Yeni dərs əlavə olunanda</div>
            </div>
            <Toggle id="set-notif-course" checked={settings.notifCourse} onChange={v => set('notifCourse', v)} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Sistem bildirişləri</div>
              <div className="settings-row-sub">Platforma yenilikləri</div>
            </div>
            <Toggle id="set-notif-sys" checked={settings.notifSys} onChange={v => set('notifSys', v)} />
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-group">
          <div className="settings-group-label">Görünüş</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Kod yağışı animasiyası</div>
              <div className="settings-row-sub">Hero bölməsindəki arxa fon</div>
            </div>
            <Toggle id="set-rain" checked={settings.rain} onChange={v => set('rain', v)} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Kod yazıcı animasiyası</div>
              <div className="settings-row-sub">Sağ tərəfdəki terminal</div>
            </div>
            <Toggle id="set-typewriter" checked={settings.typewriter} onChange={v => set('typewriter', v)} />
          </div>
        </div>

        {/* Danger zone */}
        <div className="settings-group settings-danger">
          <div className="settings-group-label">Hesab</div>
          <div className="settings-row" style={{ border: 'none', padding: 0 }}>
            <button onClick={onClose}>Hesabdan çıx</button>
          </div>
        </div>
      </div>
    </div>
  );
}
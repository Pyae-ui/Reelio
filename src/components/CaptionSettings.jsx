import { useState } from 'react';
import './CaptionSettings.css';

export default function CaptionSettings() {
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [bgOpacity, setBgOpacity] = useState('rgba(0,0,0,0.7)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard-view settings-view">
      <div className="content-section">
        <h2>Multilingual Caption & Subtitle Preferences</h2>
        <p className="settings-subtitle">
          Customize how subtitles are rendered across all streams and localization pipelines.
        </p>

        <div className="settings-container">
          <form onSubmit={handleSave} className="settings-form">
            <div className="form-group">
              <label>Default Subtitle Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English (US)</option>
                <option value="my">Burmese (မြန်မာ)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="ja">Japanese (日本語)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Font Size</label>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                <option value="small">Small (14px)</option>
                <option value="medium">Medium (18px)</option>
                <option value="large">Large (24px)</option>
                <option value="extra-large">Extra Large (32px)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Text Color</label>
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  value={fontColor} 
                  onChange={(e) => setFontColor(e.target.value)} 
                />
                <span>{fontColor}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Background Box Opacity</label>
              <select value={bgOpacity} onChange={(e) => setBgOpacity(e.target.value)}>
                <option value="rgba(0,0,0,0)">Transparent (0%)</option>
                <option value="rgba(0,0,0,0.4)">Semi-Transparent (40%)</option>
                <option value="rgba(0,0,0,0.7)">Standard Dark (70%)</option>
                <option value="rgba(0,0,0,0.95)">Solid Black (95%)</option>
              </select>
            </div>

            <button type="submit" className="save-btn">Save Preferences</button>
            {saved && <span className="success-msg">Preferences saved successfully!</span>}
          </form>

          <div className="preview-panel">
            <h3>Live Subtitle Preview</h3>
            <div className="video-player-mock">
              <div className="mock-backdrop"></div>
              <div 
                className={`caption-overlay ${fontSize}`}
                style={{ 
                  color: fontColor, 
                  backgroundColor: bgOpacity 
                }}
              >
                {language === 'my' && "မင်္ဂလာပါ — Reelio မှ ကြိုဆိုပါတယ်ရှင်။"}
                {language === 'en' && "Hello and welcome to Reelio streaming platform."}
                {language === 'es' && "Hola y bienvenidos a la plataforma de streaming Reelio."}
                {language === 'fr' && "Bonjour et bienvenue sur la plateforme de streaming Reelio."}
                {language === 'ja' && "Reelioストリーミングプラットフォームへようこそ。"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
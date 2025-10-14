'use client';
import { useEffect, useState } from 'react';

type Operation = 'crop' | 'rotate' | 'resize';

export default function AdminPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [operation, setOperation] = useState<Operation>('crop');
  const [params, setParams] = useState({
    width: '200',
    height: '200',
    angle: '90',
  });
  const [msg, setMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // --- NUOVO STATO PER GESTIRE LO STILE DELL'ANTEPRIMA ---
  const [previewStyle, setPreviewStyle] = useState<{ container: React.CSSProperties, image: React.CSSProperties }>({ container: {}, image: {} });

  async function loadFiles() {
    try {
      const r = await fetch('/api/images');
      if (r.ok) {
        const fileList = await r.json();
        setFiles(fileList);
        if (fileList.length > 0 && !selectedFile) {
          setSelectedFile(fileList[0]);
        }
      }
    } catch (error) {
      setMsg({ type: 'error', text: 'Errore nel caricamento dei file.' });
    }
  }

  useEffect(() => { loadFiles(); }, []);

  // --- NUOVO USEEFFECT PER AGGIORNARE L'ANTEPRIMA IN TEMPO REALE ---
  useEffect(() => {
    if (!selectedFile) return;

    let newContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    };
    let newImageStyle: React.CSSProperties = {
      // Stile di base per l'immagine
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    };

    // Simula le trasformazioni con CSS
    switch (operation) {
      case 'crop':
        newContainerStyle = {
          ...newContainerStyle,
          width: `${params.width}px`,
          height: `${params.height}px`,
          overflow: 'hidden',
          position: 'relative',
          maxWidth: '100%', 
        };
        newImageStyle = {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'auto',
          height: 'auto',
          maxWidth: 'none',
          maxHeight: 'none',
        };
        break;
      case 'rotate':
        newImageStyle.transform = `rotate(${params.angle}deg)`;
        break;
      case 'resize':
        newImageStyle.width = `${params.width}px`;
        newImageStyle.height = 'auto'; // Mantiene le proporzioni
        break;
      default:
        break;
    }
    setPreviewStyle({ container: newContainerStyle, image: newImageStyle });
  }, [selectedFile, operation, params]); // Si attiva a ogni cambio

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  async function handleTransform(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setMsg({ type: 'error', text: 'Seleziona un file.' });
      return;
    }
    setMsg({ type: 'info', text: 'Elaborazione in corso...' });
    setLoading(true);

    try {
      const r = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, operation, params }),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error || 'Errore sconosciuto');
      setMsg({ type: 'success', text: result.message });
      await loadFiles();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const renderParamFields = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ fontWeight: 600, color: '#9fb6c3' }}>Parametri Operazione</label>
      <div style={{ display: 'flex', gap: 10 }}>
        {operation === 'crop' && (<>
          <input name="width" className="input-dark" placeholder="Width" value={params.width} onChange={handleParamChange} />
          <input name="height" className="input-dark" placeholder="Height" value={params.height} onChange={handleParamChange} />
        </>)}
        {operation === 'rotate' && (<input name="angle" className="input-dark" placeholder="Angle" value={params.angle} onChange={handleParamChange} />)}
        {operation === 'resize' && (<input name="width" className="input-dark" placeholder="New Width" value={params.width} onChange={handleParamChange} />)}
      </div>
    </div>
  );

  const previewUrl = selectedFile ? `/images/${encodeURIComponent(selectedFile)}` : null;

  return (
    <div style={{ minHeight: '70vh', padding: '48px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: 960, borderRadius: 16, padding: 28, background: 'linear-gradient(180deg, rgba(6,9,14,0.9), rgba(8,14,22,0.85))', boxShadow: '0 20px 60px rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <h2 style={{ margin: '0 0 18px 0', fontSize: 26, fontWeight: 800, color: '#e5e7eb' }}>Pannello di Trasformazione</h2>
        
        <form onSubmit={handleTransform} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontWeight: 600, color: '#9fb6c3' }}>File e Operazione</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} className="select-dark">
                  {files.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={operation} onChange={(e) => setOperation(e.target.value as Operation)} className="select-dark">
                  <option value="crop">Crop</option>
                  <option value="rotate">Rotate</option>
                  <option value="resize">Resize</option>
                </select>
              </div>
            </div>
            {renderParamFields()}
            <div style={{ marginTop: 'auto' }}>
              <button type="submit" disabled={loading || !selectedFile} className="btn-primary">{loading ? 'Elaborazione...' : 'Applica Trasformazione'}</button>
              <div style={{ color: msg?.type === 'error' ? '#f87171' : msg?.type === 'success' ? '#4ade80' : '#9fb6c3', marginTop: 12, fontSize: 14, minHeight: 20 }}>{msg?.text}</div>
            </div>
          </div>

          {/* --- ANTEPRIMA DINAMICA APPLICANDO GLI STILI --- */}
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#051018', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewUrl ? (
              <div style={previewStyle.container}>
                <img src={previewUrl} alt="Preview" style={previewStyle.image} />
              </div>
            ) : (
              <div style={{ color: '#9fb6c3', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Anteprima Immagine</div>
                <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Nessun file selezionato</div>
              </div>
            )}
          </div>
        </form>

        <h3 style={{ marginTop: 32, marginBottom: 16, color: '#e5e7eb' }}>Galleria Immagini</h3>
        <div className="grid">
          {files.map(f => (
            <div key={f} className="thumb" onClick={() => setSelectedFile(f)} style={{ cursor: 'pointer', border: selectedFile === f ? '2px solid #3b82f6' : '2px solid transparent' }}>
              {/* --- FIX CSS PER L'IMMAGINE NELLA GALLERIA --- */}
              <img 
                src={`/images/${encodeURIComponent(f)}`} 
                alt={f} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div className="small">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
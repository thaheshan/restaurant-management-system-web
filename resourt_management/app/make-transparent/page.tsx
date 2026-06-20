'use client'

import React, { useState } from 'react';

export default function MakeTransparent() {
  const [status, setStatus] = useState('Ready');

  const processImage = () => {
    setStatus('Processing image...');
    const img = new Image();
    
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Advanced white background removal with anti-aliasing
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Define pure white threshold
        if (r > 240 && g > 240 && b > 240) {
          data[i+3] = 0; // Completely transparent
        } else if (r > 200 && g > 200 && b > 200) {
          // Anti-aliasing edge blending
          const avg = (r + g + b) / 3;
          const alpha = 255 - ((avg - 200) / 40) * 255;
          data[i+3] = Math.max(0, Math.min(255, alpha));
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      const base64Data = canvas.toDataURL('image/png');
      
      try {
        const res = await fetch('/api/save-logo', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) {
          setStatus('✅ Success! The white background was permanently removed and saved. You can close this page and refresh your app!');
        } else {
          setStatus('❌ Failed to save file via API.');
        }
      } catch (e: any) {
        setStatus('❌ Error: ' + e.message);
      }
    };
    
    img.onerror = () => {
      setStatus('❌ Could not load /futura_logo.png. Make sure it exists in the public folder.');
    }
    
    img.src = '/futura_logo.png';
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#1a3a2a' }}>Futura Logo Transparency Tool</h1>
      <p style={{ marginBottom: '24px', color: '#4a5568' }}>
        Click the button below. This tool will use your browser's native canvas to precisely strip the white background from the logo and permanently save the transparent version to your project files.
      </p>
      
      <div style={{ padding: '20px', background: '#f7fafc', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
        <img src="/futura_logo.png" alt="Current Logo" style={{ height: '100px', objectFit: 'contain', border: '1px dashed #cbd5e0' }} />
        <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>Current Logo</p>
      </div>

      <button 
        onClick={processImage}
        style={{ width: '100%', padding: '12px 24px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)' }}
      >
        Make Logo Transparent
      </button>
      
      <p style={{ marginTop: '20px', fontWeight: 'bold', padding: '16px', borderRadius: '6px', background: status.includes('Success') ? '#f0fff4' : '#fff', color: status.includes('Success') ? '#22543d' : '#2d3748' }}>
        {status}
      </p>
    </div>
  );
}

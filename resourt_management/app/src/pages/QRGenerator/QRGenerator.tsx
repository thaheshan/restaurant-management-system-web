'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiDownload, FiPrinter, FiArrowLeft, FiGrid, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { MdQrCode2, MdTableRestaurant } from 'react-icons/md';

const P = '#2d5a3d';

const getSession = () => {
  try {
    const s = localStorage.getItem('adminSession');
    if (s) {
      const p = JSON.parse(s);
      return { restaurantId: p.user?.restaurantId || p.restaurantId || '', token: p.token || '' };
    }
  } catch {}
  return { restaurantId: '', token: '' };
};

const QRGenerator = () => {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('1');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedTable, setGeneratedTable] = useState('');
  const [batchLoading, setBatchLoading] = useState<number | null>(null);
  const [batchQRs, setBatchQRs] = useState<Record<number, string>>({});

  const generateQR = async (tableNum: string) => {
    const { restaurantId, token } = getSession();
    setLoading(true); setError(''); setQrCode('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurant/admin/generate-qr`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ restaurantId, tableNumber: parseInt(tableNum) }),
        }
      );
      const data = await res.json();
      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        setGeneratedTable(tableNum);
      } else {
        setError('Failed to generate QR code. Check backend connection.');
      }
    } catch {
      setError('Failed to generate QR code. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerate = async (num: number) => {
    const { restaurantId, token } = getSession();
    setBatchLoading(num);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurant/admin/generate-qr`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ restaurantId, tableNumber: num }),
        }
      );
      const data = await res.json();
      if (data.success && data.qrCode) {
        setBatchQRs(prev => ({ ...prev, [num]: data.qrCode }));
      }
    } catch {}
    finally { setBatchLoading(null); }
  };

  const handleDownload = (src: string, table: string) => {
    const link = document.createElement('a');
    link.href = src; link.download = `table-${table}-qr.png`; link.click();
  };

  const handlePrint = (src: string, table: string) => {
    const win = window.open('');
    win?.document.write(`
      <html><body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#f9fafb">
        <div style="background:white;padding:32px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center">
          <h2 style="color:#2d5a3d;margin:0 0 8px;font-size:1.4rem">DineSmart</h2>
          <p style="color:#888;margin:0 0 20px;font-size:0.9rem">Scan to view menu & order</p>
          <img src="${src}" style="width:220px;height:220px" />
          <p style="margin:16px 0 0;font-size:1.1rem;font-weight:700;color:#1a1a1a">Table ${table}</p>
        </div>
      </body></html>
    `);
    win?.print(); win?.close();
  };

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: '11px 16px', border: '1px solid #e5e7eb', borderRadius: 9,
    fontSize: '0.95rem', outline: 'none', color: '#1a1a1a',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => router.push('/admin/settings')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem' }}
          >
            <FiArrowLeft size={14} /> Back to Settings
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>QR Code Generator</h1>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>Generate QR codes for your tables — customers scan to view menu & order</p>
          </div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
          <MdQrCode2 size={26} />
        </div>
      </div>

      {/* Generate Single QR */}
      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
            <MdTableRestaurant size={17} />
          </div>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>Single Table QR Code</h3>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: error ? 12 : 0 }}>
            <input
              type="number" min="1" value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              placeholder="Enter table number"
              style={inputStyle}
            />
            <button
              onClick={() => generateQR(tableNumber)}
              disabled={loading || !tableNumber}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: P, color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap' }}
            >
              <MdQrCode2 size={18} />
              {loading ? 'Generating...' : 'Generate QR'}
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#dc2626', fontSize: '0.85rem', marginTop: 12 }}>
              <FiAlertCircle size={15} /> {error}
            </div>
          )}

          {qrCode && (
            <div style={{ marginTop: 24, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* QR Image */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'white', border: '2px solid #f0f0f0', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <img src={qrCode} alt={`QR Table ${generatedTable}`} style={{ width: 180, height: 180 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(45,90,61,0.08)', borderRadius: 20 }}>
                    <MdTableRestaurant size={14} color={P} />
                    <span style={{ fontWeight: 700, color: P, fontSize: '0.85rem' }}>Table {generatedTable}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleDownload(qrCode, generatedTable)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: P, color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    <FiDownload size={14} /> Download
                  </button>
                  <button
                    onClick={() => handlePrint(qrCode, generatedTable)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'white', color: P, border: `1px solid ${P}`, borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <FiCheckCircle size={18} color="#22c55e" />
                  <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1rem' }}>QR Code Ready!</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Menu Access', desc: 'Links directly to your restaurant menu' },
                    { label: 'Mobile Ready', desc: 'Works with DineSmart app & any scanner' },
                    { label: 'Table Specific', desc: `Table ${generatedTable} — customers browse & order` },
                  ].map(info => (
                    <div key={info.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: '#f9fafb', borderRadius: 9 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: P, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.85rem' }}>{info.label}</p>
                        <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>{info.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Generator */}
      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(45,90,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
            <FiGrid size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>Batch Generator</h3>
            <p style={{ margin: 0, color: '#888', fontSize: '0.76rem' }}>Click any table to generate its QR code</p>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
              <div key={num} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
                {batchQRs[num] ? (
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <img src={batchQRs[num]} alt={`Table ${num}`} style={{ width: 90, height: 90 }} />
                    <span style={{ fontWeight: 700, color: P, fontSize: '0.8rem' }}>Table {num}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleDownload(batchQRs[num], String(num))} style={{ padding: '4px 10px', background: P, color: 'white', border: 'none', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiDownload size={11} />
                      </button>
                      <button onClick={() => handlePrint(batchQRs[num], String(num))} style={{ padding: '4px 10px', background: 'white', color: P, border: `1px solid ${P}`, borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiPrinter size={11} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBatchGenerate(num)}
                    disabled={batchLoading === num}
                    style={{ width: '100%', padding: '18px 12px', background: '#fafafa', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(45,90,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
                      {batchLoading === num ? <span style={{ fontSize: '0.7rem', color: P }}>...</span> : <MdQrCode2 size={20} />}
                    </div>
                    <span style={{ fontWeight: 600, color: '#444', fontSize: '0.8rem' }}>Table {num}</span>
                    <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{batchLoading === num ? 'Generating...' : 'Click to generate'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 0 16px', color: '#bbb', fontSize: '0.78rem' }}>
        DineSmart QR Generator · Tables link to your live menu
      </div>
    </div>
  );
};

export default QRGenerator;
"use client";

import { useState } from 'react';
import './QRGnerator.scss';

const getSession = () => {
  const session = localStorage.getItem('adminSession');
  if (session) {
    const parsed = JSON.parse(session);
    return {
      restaurantId: parsed.user?.restaurantId || parsed.restaurantId || '',
      token: parsed.token || '',
    };
  }
  return { restaurantId: '', token: '' };
};

const QRGenerator = () => {
  const [tableNumber, setTableNumber] = useState('1');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    const { restaurantId, token } = getSession();
    if (!tableNumber) return;

    setLoading(true);
    setError('');
    setQrCode('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurant/admin/generate-qr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId,
            tableNumber: parseInt(tableNumber),
          }),
        }
      );
      const data = await res.json();
      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
      } else {
        setError('Failed to generate QR code');
      }
    } catch {
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const win = window.open('');
    win?.document.write(
      `<img src="${qrCode}" style="width:400px"/><p>Table ${tableNumber}</p>`
    );
    win?.print();
    win?.close();
  };

  return (
    <div className="qr-gen">
      <div className="qr-gen__header">
        <h1 className="qr-gen__title">QR Code Generator</h1>
        <p className="qr-gen__subtitle">
          Generate QR codes for each table — customers scan to view your menu
        </p>
      </div>

      <div className="qr-gen__card">
        <div className="qr-gen__form">
          <div className="qr-gen__field">
            <label>Table Number</label>
            <input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number"
            />
          </div>
          <button
            className="qr-gen__btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {error && <p className="qr-gen__error">{error}</p>}

        {qrCode && (
          <div className="qr-gen__result">
            <div className="qr-gen__qr-wrap">
              <img src={qrCode} alt={`QR Code for Table ${tableNumber}`} />
              <p className="qr-gen__table-label">Table {tableNumber}</p>
            </div>

            <div className="qr-gen__qr-info">
              <h3>QR Code Ready!</h3>
              <p>
                When customers scan this QR code, they will be directed to
                your restaurant menu automatically.
              </p>
              <div className="qr-gen__scan-info">
                <div className="qr-gen__info-item">
                  <span>📍</span>
                  <span>Links to your restaurant menu</span>
                </div>
                <div className="qr-gen__info-item">
                  <span>📱</span>
                  <span>Works with DineSmart mobile app</span>
                </div>
                <div className="qr-gen__info-item">
                  <span>🍽</span>
                  <span>
                    Table {tableNumber} — customers can browse and order
                  </span>
                </div>
              </div>
              <div className="qr-gen__download-btns">
                <button className="btn-primary" onClick={handleDownload}>
                  ⬇ Download PNG
                </button>
                <button className="btn-secondary" onClick={handlePrint}>
                  🖨 Print QR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch generate */}
        <div className="qr-gen__batch">
          <h3>Generate for Multiple Tables</h3>
          <div className="qr-gen__batch-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                className="qr-gen__table-btn"
                onClick={() => {
                  setTableNumber(String(num));
                  handleGenerate();
                }}
              >
                Table {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
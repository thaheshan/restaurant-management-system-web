import React, { useEffect } from "react";
import { X } from "lucide-react";
interface Props { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: number; }
const Modal: React.FC<Props> = ({ isOpen, onClose, title, children, maxWidth = 560 }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;

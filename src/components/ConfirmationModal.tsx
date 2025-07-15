import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonClass = 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]',
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirmAndClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[var(--color-card)] rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-bold text-[var(--color-text-header)] mb-4">
          {title}
        </h2>
        <div className="text-[var(--color-text)] mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-lg bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)] text-[var(--color-text)] font-semibold transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={handleConfirmAndClose}
            type="button"
            className={`px-5 py-2 rounded-lg text-white font-semibold transition-colors ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
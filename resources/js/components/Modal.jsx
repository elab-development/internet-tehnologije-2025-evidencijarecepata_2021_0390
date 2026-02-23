import Button from './Button';                                                                                                                                                                                  
  
function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = 'Potvrdi' }) {                                                                                                                            if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>

                <div className="mb-6 text-gray-700">
                    {children}
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Otkaži
                    </Button>
                    {onConfirm && (
                        <Button variant="danger" onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;
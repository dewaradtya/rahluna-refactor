import { useEffect, useRef } from 'react';

const Modal = ({ title, children, showModal, setShowModal }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal, setShowModal]);

    return (
        <div
            className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`}
            tabIndex="-1"
            aria-hidden={!showModal}
            aria-modal={showModal}
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div
                    className="modal-content shadow-lg border-0"
                    ref={modalRef}
                    style={{ borderRadius: '10px', overflow: 'hidden' }}
                >
                    <div className="modal-header justify-content-center border-0">
                        <h1 className="modal-title fs-5 text-center">
                            {title}
                        </h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Body = ({ children }) => {
    return <div className="modal-body text-center">{children}</div>;
};

Modal.Body = Body;

export default Modal;

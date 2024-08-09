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
            id="staticBackdrop"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden={!showModal}
            aria-modal={showModal}
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" ref={modalRef}>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            {title}
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Body = ({ children }) => {
    return <div className="modal-body">{children}</div>;
};

const Footer = ({ children, className = '' }) => {
    return <div className={`modal-footer ${className}`}>{children}</div>;
};

Modal.Body = Body;
Modal.Footer = Footer;
export default Modal;

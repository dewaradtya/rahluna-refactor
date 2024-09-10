import React from 'react';
import Modal from '../../Components/Modal';

const TaxInvoice = ({ showModal, setShowModal, invoiceUrl }) => {
    if (!showModal) return null;

    return (
        <Modal title="Faktur Pajak" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                {invoiceUrl ? (
                    <img
                        src={invoiceUrl}
                        alt="Faktur Pajak"
                        style={{ width: '100%', height: '80vh' }}
                        frameBorder="0"
                    />
                ) : (
                    <p>No invoice available</p> 
                )}
            </Modal.Body>
        </Modal>
    );
};

export default TaxInvoice;

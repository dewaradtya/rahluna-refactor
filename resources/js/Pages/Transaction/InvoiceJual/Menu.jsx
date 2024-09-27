import { router } from '@inertiajs/react';
import Modal from '../../../Components/Modal';
import { FaMagnifyingGlass, FaRupiahSign } from 'react-icons/fa6';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import { TbFileInvoice } from 'react-icons/tb';
import { useState } from 'react';

const Menu = ({ showModal, setShowModal, invoiceJual, onEdit, onPay }) => {
    const [imageModal, setImageModal] = useState({ visible: false, src: '' });

    const handleDelete = () => {
        if (invoiceJual && invoiceJual.id) {
            router.delete(`/transaksi/invoiceJual/${invoiceJual.id}`, {
                preserveScroll: true,
                onFinish: () => setShowModal(false),
            });
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(invoiceJual);
        }
        setShowModal(false);
    };

    const handleView = () => {
        if (invoiceJual && invoiceJual.id) {
            router.visit(`/transaksi/invoiceJual/${invoiceJual.id}`);
        }
    };

    const handlePay = () => {
        if (onPay) {
            onPay(invoiceJual);
        }
        setShowModal(false);
    };

    const handleImageModalOpen = (imageSrc) => {
        const fullImageUrl = `http://localhost:8000/storage/${imageSrc}`;
        setImageModal({ visible: true, src: fullImageUrl });
        console.log(fullImageUrl);
    };

    const handleImageModalClose = () => {
        setImageModal({ visible: false, src: '' });
    };

    return (
        <>
            <Modal title="Aksi" showModal={showModal} setShowModal={setShowModal}>
                <Modal.Body>
                    <div className="d-flex justify-content-around mb-4">
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <RiDeleteBin6Fill size={24} />
                            <span className="mt-2 small">Hapus</span>
                        </button>

                        <button
                            onClick={handleView}
                            className="btn btn-primary d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <FaMagnifyingGlass size={24} />
                            <span className="mt-2 small">Lihat</span>
                        </button>

                        <button
                            onClick={handleEdit}
                            className="btn btn-warning d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <MdEdit size={24} />
                            <span>Edit</span>
                        </button>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button
                            onClick={handlePay}
                            className="btn btn-dark d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <FaRupiahSign size={24} />
                            <span className="mt-2 small">Bayar</span>
                        </button>

                        <button
                            onClick={() => handleImageModalOpen(invoiceJual.faktur_pajak)} 
                            className="btn btn-success d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <TbFileInvoice size={24} />
                            <span className="mt-2 small">Faktur</span>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
            {imageModal.visible && (
                <Modal title="Bukti" showModal={imageModal.visible} setShowModal={handleImageModalClose}>
                    <Modal.Body className="text-center">
                        <img
                            src={imageModal.src}
                            alt="Bukti"
                            className="img-fluid"
                            style={{ maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default Menu;

import { router } from '@inertiajs/react';
import Modal from '../../../Components/Modal';
import { FaMagnifyingGlass, FaRupiahSign } from 'react-icons/fa6';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import { TbFileInvoice } from 'react-icons/tb';

const Menu = ({ showModal, setShowModal, invoiceJual, onEdit, onPay }) => {

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

    return (
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
                        onClick={() => {/* Add functionality for Faktur here */}}
                        className="btn btn-success d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <TbFileInvoice size={24} />
                        <span className="mt-2 small">Faktur</span>
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Menu;

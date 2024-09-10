import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '../../Components/Modal';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import { FaDownload, FaFileInvoiceDollar } from 'react-icons/fa';
import { LuCheckCircle } from 'react-icons/lu';
import { TbFileInvoice } from 'react-icons/tb';
import TaxInvoice from './TaxInvoice'; 

const Menu = ({ showModal, setShowModal, purchase, onEdit }) => {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    const handleDelete = () => {
        if (purchase && purchase.id) {
            router.delete(`/purchase/${purchase.id}`, {
                preserveScroll: true,
                onStart: () => {},
                onFinish: () => {
                    setShowModal(false);
                },
                onError: () => {}
            });
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(purchase);
        }
        setShowModal(false);
    };

    const handleView = () => {
        if (purchase && purchase.id) {
            router.visit(`/purchase/${purchase.id}`);
        }
    };

    const handleViewPdf = () => {
        window.location.href = `/purchase/${purchase.id}/pdf`;
    };

    const handleDownloadPdf = () => {
        if (purchase && purchase.id) {
            window.open(`/purchase/${purchase.id}/pdf`, '_blank');
        }
    };

    const handleViewTaxInvoice = () => {
        if (purchase && purchase.id) {
            setShowInvoiceModal(true);
        }
    };

    const invoiceUrl = purchase ? `/storage/purchases/${purchase.tax_invoice}` : '';

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

                        <button
                            onClick={handleViewPdf}
                            className="btn btn-info d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <LuCheckCircle size={24} />
                            <span>Koreksi</span>
                        </button>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button
                            onClick={handleDownloadPdf}
                            className="btn btn-dark d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <FaDownload size={24} />
                            <span className="mt-2 small">PDF</span>
                        </button>

                        <button
                            onClick={handleViewTaxInvoice}
                            className="btn btn-success d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <TbFileInvoice size={24} />
                            <span className="mt-2 small">Faktur</span>
                        </button>

                        <button
                            onClick={handleViewTaxInvoice}
                            className="btn btn-primary d-flex flex-column align-items-center justify-content-center rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        >
                            <FaFileInvoiceDollar size={24} />
                            <span>Invoice</span>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <TaxInvoice showModal={showInvoiceModal} setShowModal={setShowInvoiceModal} invoiceUrl={invoiceUrl} />
        </>
    );
};

export default Menu;

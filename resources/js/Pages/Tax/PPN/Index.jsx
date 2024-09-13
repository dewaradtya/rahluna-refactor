import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import Card from '../../../Components/Card';
import { rupiah } from '../../../utils';
import BadgeButton from '../../../Components/Button/BadgeButton';
import Update from './Update';
import Modal from '../../../Components/Modal';

const Index = ({ invoice }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [loadingButton, setLoadingButton] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, invoice: null });
    const [imageModal, setImageModal] = useState({ visible: false, src: '' });

    const handleEditButton = (invoice) => {
        setShowUpdateModal({ modal: true, invoice: invoice });
    };

    const handleImageModalOpen = (imageSrc) => {
        setImageModal({ visible: true, src: imageSrc });
    };

    const handleImageModalClose = () => {
        setImageModal({ visible: false, src: '' });
    };

    const filteredInvoice = invoice.data.filter((invoice) =>
        invoice.nama_invoice.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal Dibuat',
                name: 'tanggal_dibuat',
                renderCell: (row) => row.tanggal_dibuat
            },
            {
                label: 'Nama Invoice',
                name: 'nama_invoice',
                renderCell: (row) => row.nama_invoice
            },
            {
                label: 'Nilai Invoice',
                name: 'total_nilai',
                renderCell: (row) => rupiah(row.totalinvoice)
            },
            {
                label: 'PPN PPH Dibayar Customer',
                name: 'ppn_pph_customer',
                renderCell: (row) => rupiah(row.ppn_pph_customer)
            },
            {
                label: 'PPN',
                name: 'ppn',
                renderCell: (row) => rupiah(row.ppn_customer)
            },
            {
                label: 'PPH',
                name: 'pph',
                renderCell: (row) => rupiah(row.pph_customer)
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleEditButton(row)}
                            text="Edit"
                            color="warning"
                            disabled={loadingButton !== null}
                        />
                        {row.bukti_customer && (
                            <BadgeButton
                                onClick={() => handleImageModalOpen(row.bukti_customer)}
                                text="lihat bukti"
                                color="dark"
                                disabled={loadingButton !== null}
                            />
                        )}
                    </>
                )
            }
        ],
        [loadingButton]
    );

    return (
        <Card>
            <Card.CardHeader titleText="Table Potongan PPN dan PPH" />
            <Card.CardBody>
                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />

                <Table columns={columns} rows={filteredInvoice.slice(0, entriesPerPage)} />
                <Pagination links={invoice.links} />
            </Card.CardBody>

            {/* Modal untuk Update Invoice */}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={() => setShowUpdateModal({ modal: false, invoice: null })}
                    invoice={showUpdateModal.invoice}
                />
            )}
            {imageModal.visible && (
                <Modal title="Bukti" showModal={imageModal.visible} setShowModal={handleImageModalClose}>
                    <Modal.Body>
                        <img src={imageModal.src} alt="Bukti" className="w-full" />
                    </Modal.Body>
                </Modal>
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Potongan PPN dan PPH Page" />;

export default Index;

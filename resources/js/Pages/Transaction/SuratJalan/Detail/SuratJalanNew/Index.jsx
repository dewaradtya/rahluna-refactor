import React, { useMemo, useState } from 'react';
import Table from '../../../../../Components/Table';
import Card from '../../../../../Components/Card';
import BadgeButton from '../../../../../Components/Button/BadgeButton';
import { FaCheck, FaPlus } from 'react-icons/fa';
import Pagination from '../../../../../Components/Pagination';
import Confirm from '../../../../../Components/Confirm/Confirm';
import SplitButton from '../../../../../Components/Button/SplitButton';
import InvoiceModal from './InvoiceModal';
import { router } from '@inertiajs/react';
import Update from './Update';

const SuratJalanNewCard = ({ customer, suratJalanNew }) => {
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedSuratJalanNewRows, setSelectedSuratJalanNewRows] = useState([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showUpdateSjModal, setShowUpdateSjModal] = useState({ modal: false, suratJalanNew: null });

    const handleDeleteSjNewButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDeleteSj = () => {
        if (itemToDelete) {
            router.delete(`/transaksi/suratJalanNew/${itemToDelete}`, {
                preserveScroll: true,
                onStart: () => setLoadingButton(itemToDelete),
                onFinish: () => {
                    setLoadingButton(null);
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
                onError: () => {
                    setLoadingButton(null);
                    setShowDeleteModal(false);
                }
            });
        }
    };

    const handleEditSjButton = (suratJalanNew) => {
        setShowUpdateSjModal({ modal: true, suratJalanNew });
    };

    const handleDownloadPdf = (id) => {
        if (id) {
            window.open(`/transaksi/suratJalanNew/${id}/pdf`, '_blank');
        }
    };

    const handleLihatButton = (id) => {
        router.get(`/transaksi/suratJalanNew/${id}`);
    };

    const handleCheckboxChange = (rowId) => {
        setSelectedSuratJalanNewRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
    };
    const sortedSuratJalanNew = useMemo(() => {
        return [...suratJalanNew.data].sort((a, b) => {
            if (a.invoice_id && !b.invoice_id) return 1;
            if (!a.invoice_id && b.invoice_id) return -1;
            return 0;
        });
    }, [suratJalanNew]);

    const suratJalanNewColumns = useMemo(
        () => [
            {
                label: '#',
                name: 'select',
                renderCell: (row) => (
                    <div className="text-center">
                        {row.invoice_id != null ? (
                            <FaCheck color="green" />
                        ) : (
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(row.id, true)}
                                checked={selectedSuratJalanNewRows.includes(row.id)}
                            />
                        )}
                    </div>
                ),
                className: 'text-center',
                width: '50px'
            },
            { label: 'No. Surat', name: 'no_surat', renderCell: (row) => row.no_surat },
            { label: 'Tanggal Kirim', name: 'tanggal_kirim', renderCell: (row) => row.tanggal_kirim },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleDeleteSjNewButton(row.id)}
                            text={`${loadingButton === row.id ? 'Loading...' : 'Hapus'}`}
                            color="danger"
                            disabled={row.invoice_id != null}
                        />
                        <BadgeButton onClick={() => handleEditSjButton(row)} text="Edit" color="warning" />
                        <BadgeButton
                            onClick={() => handleLihatButton(row.id)}
                            text="lihat"
                            color="info"
                            disabled={loadingButton !== null}
                        />{' '}
                        <BadgeButton onClick={() => handleDownloadPdf(row.id)} text="Print" color="dark" />
                    </>
                )
            }
        ],
        [loadingButton, selectedSuratJalanNewRows, suratJalanNew]
    );

    return (
        <Card>
            <Card.CardHeader titleText="Data Surat Jalan New" />
            <Card.CardBody>
                <div className="d-flex column-gap-1 align-items-start flex-wrap">
                    <SplitButton
                        color="success"
                        text="Invoice"
                        icon={<FaPlus />}
                        onClick={() => setShowInvoiceModal(true)}
                        disabled={selectedSuratJalanNewRows.length === 0}
                    />
                </div>
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table columns={suratJalanNewColumns} rows={sortedSuratJalanNew} />
                <Pagination
                    links={suratJalanNew.links}
                    currentPage={suratJalanNew.current_page}
                    totalEntries={suratJalanNew.total}
                    perPage={suratJalanNew.per_page}
                />
            </Card.CardBody>
            {showInvoiceModal && (
                <InvoiceModal
                    showModal={showInvoiceModal}
                    setShowModal={setShowInvoiceModal}
                    selectedRows={selectedSuratJalanNewRows}
                    customerId={customer.id}
                    selectedSuratJalanNewRows={selectedSuratJalanNewRows}
                />
            )}
            {showUpdateSjModal.modal && (
                <Update
                    showModal={showUpdateSjModal.modal}
                    setShowModal={setShowUpdateSjModal}
                    suratJalanNew={showUpdateSjModal.suratJalanNew}
                />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDeleteSj}
                dataType="surat jalan new"
            />
        </Card>
    );
};

export default SuratJalanNewCard;

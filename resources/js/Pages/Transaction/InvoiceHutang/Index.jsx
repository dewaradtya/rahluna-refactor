import MainLayout from '../../../Layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import BadgeLink from '../../../Components/Link/BadgeLink';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../utils';
import Card from '../../../Components/Card';
import Create from './Create';
import Update from './Update';
import Confirm from '../../../Components/Confirm/Confirm';

const Index = ({ debtInvoices }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debtInvoice: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/transaksi/invoiceHutang/${itemToDelete}`, {
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

    const handleEditButton = (debtInvoice) => {
        setShowUpdateModal({ modal: true, debtInvoice: debtInvoice });
    };

    const filteredDebtInvoices = debtInvoices.data.filter(
        (debtInvoice) =>
            debtInvoice.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            debtInvoice.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Supplier',
                name: 'origin'
            },
            {
                label: 'Nilai Hutang',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Jumlah Bayar',
                name: 'total_payment',
                renderCell: (row) => rupiah(row.total_payment)
            },
            {
                label: 'Sisa Hutang',
                name: 'remaining',
                renderCell: (row) => rupiah(row.remaining)
            },
            {
                label: 'Jatuh Tempo',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => {
                    const remaining = Number(row.remaining);
                    const color = remaining === 0 ? 'success' : remaining > 0 ? 'danger' : 'warning';
                    const status =
                        remaining === 0
                            ? 'Selesai'
                            : remaining > 0
                            ? new Date() > new Date(row.date)
                                ? 'over time'
                                : 'process'
                            : 'unknown';

                    return <BadgeButton text={status} color={color} />;
                }
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleDeleteButton(row.id)}
                            text={`${loadingButton === row.id ? 'loading...' : 'hapus'}`}
                            color="danger"
                            disabled={loadingButton !== null}
                        />
                        <BadgeButton
                            onClick={() => handleEditButton(row)}
                            text="edit"
                            color="warning"
                            disabled={loadingButton !== null}
                        />
                        <BadgeLink href={`/transaksi/invoiceHutang/${row.id}`} text="lihat detail" color="info" />
                    </>
                )
            }
        ],
        [loadingButton]
    );

    const totals = useMemo(() => {
        const TotalSisaHutang = debtInvoices.data.reduce((total, row) => total + (Number(row.remaining) || 0), 0);

        return {
            TotalSisaHutang: rupiah(TotalSisaHutang)
        };
    }, [debtInvoices]);

    const footerColumns = [{ key: 'TotalSisaHutang', label: 'Total Sisa Hutang' }];

    return (
        <>
            <Card>
                <Card.CardHeader titleText="Table Hutang Invoice Beli" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="primary"
                                text="Hutang Inv Baru"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '10px' : '5px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
                            />
                        </div>
                    </div>
                    {/* Input pencarian dan dropdown entri per halaman */}
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table
                        columns={columns}
                        rows={filteredDebtInvoices.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination
                        links={debtInvoices.links}
                        currentPage={debtInvoices.current_page}
                        totalEntries={debtInvoices.total}
                        perPage={debtInvoices.per_page}
                    />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        debtInvoice={showUpdateModal.debtInvoice}
                    />
                )}
                <Confirm
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                    onDelete={handleConfirmDelete}
                    dataType="debt invoice"
                />
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Invoice Beli Page" />;

export default Index;

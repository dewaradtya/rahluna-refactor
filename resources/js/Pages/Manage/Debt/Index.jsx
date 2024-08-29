import MainLayout from '../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import BadgeLink from '../../../Components/Link/BadgeLink';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../utils';
import Card from '../../../Components/Card';
import Confirm from '../../../Components/Confirm/Confirm';

const Index = ({ debts }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debt: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/hutang/${itemToDelete}`, {
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

    const handleEditButton = (debt) => {
        setShowUpdateModal({ modal: true, debt: debt });
    };

    const filteredDebt = debts.data.filter(
        (debt) =>
            debt.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            debt.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Asal Hutang',
                name: 'origin'
            },
            {
                label: 'Nilai Hutang',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Nilai Bunga',
                name: 'interest_amount',
                renderCell: (row) => rupiah(row.interest_amount)
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
                label: 'Tanggal Kembali',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
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
                        <BadgeLink href={`/hutang/${row.id}`} text="lihat detail" color="info" />
                    </>
                )
            }
        ],
        [loadingButton]
    );

    const totals = useMemo(() => {
        const TotalSisaHutang = debts.data.reduce((total, row) => total + (Number(row.remaining) || 0), 0);

        return {
            TotalSisaHutang: rupiah(TotalSisaHutang)
        };
    }, [debts]);

    const footerColumns = [{ key: 'TotalSisaHutang', label: 'Total Sisa Hutang' }];

    return (
        <>
            <Card>
                <Card.CardHeader titleText="Table Hutang" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="primary"
                                text="Hutang Baru"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
                            />
                        </div>
                    </div>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table
                        columns={columns}
                        rows={filteredDebt.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={debts.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update showModal={showUpdateModal.modal} setShowModal={setShowUpdateModal} debt={showUpdateModal.debt} />
                )}
                <Confirm showModal={showDeleteModal} setShowModal={setShowDeleteModal} onDelete={handleConfirmDelete} dataType="debt"/>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Page" />;

export default Index;

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

const Index = ({ debts }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debt: null });
    const [loadingButton, setLoadingButton] = useState(null);

    const handleEditButton = (debt) => {
        setShowUpdateModal({ modal: true, debt: debt });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/hutang/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

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

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Hutang</h1>

                <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
            </div>

            <Table columns={columns} rows={debts.data} />
            <Pagination links={debts.links} />

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
            {showUpdateModal.modal && (
                <Update showModal={showUpdateModal.modal} setShowModal={setShowUpdateModal} debt={showUpdateModal.debt} />
            )}
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Page" />;

export default Index;

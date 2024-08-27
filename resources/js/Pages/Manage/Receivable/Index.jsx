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

const Index = ({ receivables }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, receivable: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const handleEditButton = (receivable) => {
        setShowUpdateModal({ modal: true, receivable: receivable });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/piutang/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const filteredReceivable = receivables.data.filter(
        (receivable) =>
            receivable.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receivable.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Asal Piutang',
                name: 'origin'
            },
            {
                label: 'Nilai',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Jumlah Bayar',
                name: 'total_payment',
                renderCell: (row) => rupiah(row.total_payment)
            },
            {
                label: 'Sisa Piutang',
                name: 'remaining',
                renderCell: (row) => rupiah(row.remaining)
            },
            {
                label: 'Tanggal',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
            },
            {
                label: 'Keterangan',
                name: 'description',
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
                        <BadgeLink href={`/piutang/${row.id}`} text="lihat detail" color="info" />
                    </>
                )
            }
        ],
        [loadingButton]
    );

    const totals = useMemo(() => {
        const TotalSisaHutang = receivables.data.reduce((total, row) => total + (Number(row.remaining) || 0), 0);

        return {
            TotalSisaHutang: rupiah(TotalSisaHutang)
        };
    }, [receivables]);

    const footerColumns = [{ key: 'TotalSisaHutang', label: 'Total Sisa Hutang' }];

    return (
        <>
             <Card>
                <Card.CardHeader titleText="Table Piutang" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="primary"
                                text="Piutang Baru"
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
                        rows={filteredReceivable.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={receivables.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        receivable={showUpdateModal.receivable}
                    />
                )}
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Piutang Page" />;

export default Index;

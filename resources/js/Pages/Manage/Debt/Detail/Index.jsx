import MainLayout from '../../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../../../Components/Table';
import Pagination from '../../../../Components/Pagination';
import SplitButton from '../../../../Components/Button/SplitButton';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../../utils';
import Card from '../../../../Components/Card';
import Confirm from '../../../../Components/Confirm/Confirm';

const Index = ({ debt, debtDetails }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debtDetail: null });
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
            router.delete(`/hutang/detail/${itemToDelete}`, {
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

    const handleEditButton = (debtDetail) => {
        setShowUpdateModal({ modal: true, debtDetail: debtDetail });
    };

    const handleBackButton = () => {
        router.get('/hutang');
    };

    const filteredDebtDetail = debtDetails.data.filter((debtDetail) =>
        debtDetail.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
            },
            {
                label: 'Nilai',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Keterangan',
                name: 'description'
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
                        {row.proof && (
                            <BadgeButton
                                onClick={() => console.log('lihat bukti')}
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

    const totals = useMemo(() => {
        const TotalHutang = debtDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const TotalBayar = debtDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const TotalKurang = debtDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);

        return {
            TotalHutang: rupiah(TotalHutang),
            TotalBayar: rupiah(TotalBayar),
            TotalKurang: rupiah(TotalKurang)
        };
    }, [debtDetails]);

    const footerColumns = [
        { key: 'TotalHutang', label: 'Total Hutang' },
        { key: 'TotalBayar', label: 'Total Bayar' },
        { key: 'TotalKurang', label: 'Total Kurang' }
    ];
    return (
        <>
            <Card>
                <Card.CardHeader
                    titleText="Table Hutang Detail"
                    rightComponent={
                        <SplitButton color="danger" text="Hutang" icon={<FaArrowLeft />} onClick={() => handleBackButton(true)} />
                    }
                />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="success"
                                text="Bayar Hutang"
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
                        rows={filteredDebtDetail.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={debtDetails.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} debtId={debt.id} />}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        debtDetail={showUpdateModal.debtDetail}
                    />
                )}
                <Confirm showModal={showDeleteModal} setShowModal={setShowDeleteModal} onDelete={handleConfirmDelete} dataType="debt detail"/>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Detail Page" />;

export default Index;

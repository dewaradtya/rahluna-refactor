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

const Index = ({ debtInvoice, debtInvoiceDetails }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debtInvoiceDetail: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const handleEditButton = (debtInvoiceDetail) => {
        setShowUpdateModal({ modal: true, debtInvoiceDetail: debtInvoiceDetail });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/transaksi/invoiceHutang/detail/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const handleBackButton = () => {
        router.get('/transaksi/invoiceHutang');
    };

    const filteredDebtInvoiceDetail = debtInvoiceDetails.data.filter(
        (debtInvoiceDetail) =>
            debtInvoiceDetail.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            debtInvoiceDetail.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
        const TotalHutang = debtInvoiceDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const TotalBayar = debtInvoiceDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const TotalKurang = debtInvoiceDetails.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);

        return {
            TotalHutang: rupiah(TotalHutang),
            TotalBayar: rupiah(TotalBayar),
            TotalKurang: rupiah(TotalKurang)
        };
    }, [debtInvoiceDetails]);

    const footerColumns = [
        { key: 'TotalHutang', label: 'Total Hutang' },
        { key: 'TotalBayar', label: 'Total Bayar' },
        { key: 'TotalKurang', label: 'Total Kurang' }
    ];

    return (
        <>
            <Card>
                <Card.CardHeader
                    titleText="Table Hutang Invoice Beli Detail"
                    rightComponent={
                        <SplitButton
                            color="danger"
                            text="Inv Hutang"
                            icon={<FaArrowLeft />}
                            onClick={() => handleBackButton(true)}
                        />
                    }
                />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="success"
                                text="Bayar Hutang Inv"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
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
                        rows={filteredDebtInvoiceDetail.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={debtInvoiceDetails.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal}  debtInvoiceId={debtInvoice.id}/>}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        debtInvoiceDetail={showUpdateModal.debtInvoiceDetail}
                    />
                )}
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Invoice Detail Page" />;

export default Index;

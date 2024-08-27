import MainLayout from '../../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
// import Create from './Create';
// import Update from './Update';
import Table from '../../../../Components/Table';
import Pagination from '../../../../Components/Pagination';
import SplitButton from '../../../../Components/Button/SplitButton';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../../utils';

const Index = ({ debtInvoice, debtInvoiceDetails }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, debtInvoiceDetail: null });
    const [loadingButton, setLoadingButton] = useState(null);

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

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Hutang Invoice Detail</h1>

                <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
            </div>

            <Table columns={columns} rows={debtInvoiceDetails.data} />
            <Pagination links={debtInvoiceDetails.links} />

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} debtInvoiceId={debtInvoice.id} />}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    debtInvoiceDetail={showUpdateModal.debtInvoiceDetail}
                />
            )}
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Hutang Invoice Detail Page" />;

export default Index;

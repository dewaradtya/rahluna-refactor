import MainLayout from '../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import { FaArrowLeft, FaDownload, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../utils';
import Card from '../../../Components/Card';
import Confirm from '../../../Components/Confirm/Confirm';

const Index = ({ purchase, purchaseDetails }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, purchaseDetail: null });
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
            router.delete(`/purchase/detail/${itemToDelete}`, {
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

    const handleEditButton = (purchaseDetail) => {
        setShowUpdateModal({ modal: true, purchaseDetail: purchaseDetail });
    };

    const handleDownloadPdf = () => {
        if (purchase && purchase.id) {
            window.open(`/purchase/${purchase.id}/pdf`, '_blank');
        }
    };

    const handleBackButton = () => {
        router.get('/purchase');
    };

    const filteredpurchaseDetail = purchaseDetails.data.filter(
        (purchaseDetail) =>
            purchaseDetail.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchaseDetail.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Deskripsi (Material/Jasa)',
                name: 'product'
            },
            {
                label: 'Qty',
                name: 'qty'
            },
            {
                label: 'Harga',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Total Harga',
                name: 'total',
                renderCell: (row) => rupiah(row.amount * row.qty)
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
        const totalAmount = purchaseDetails.data.reduce((acc, { amount, qty }) => {
            return acc + (Number(amount) * Number(qty) || 0);
        }, 0);

        return {
            Total: rupiah(totalAmount)
        };
    }, [purchaseDetails]);

    const footerColumns = [{ key: 'Total', label: 'Total Semua' }];

    return (
        <>
            <Card>
                <Card.CardHeader
                    titleText="Detail Purchase Order"
                    rightComponent={<SplitButton color="danger" text="PO" icon={<FaArrowLeft />} onClick={handleBackButton} />}
                />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="success"
                                text="Deskripsi"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
                            />
                            <SplitButton color="warning" text="PDF" icon={<FaDownload />} onClick={handleDownloadPdf} />
                        </div>
                    </div>
                    <div className="mb-2">
                        <p className="fw-bold mb-0">
                            Nama Project:{' '}
                            <span className="fw-normal">{purchase?.project ? purchase.project.name : 'No project Selected'}</span>
                        </p>
                        <p className="fw-bold mb-0">
                            Supplier:{' '}
                            <span className="fw-normal">{purchase ? `${purchase.supply}` : 'No purchase Selected'}</span>
                        </p>
                        <p className="fw-bold mb-0">
                            Delivery Date:{' '}
                            <span className="fw-normal">{purchase ? `${purchase.delivery_date}` : 'No purchase Selected'}</span>
                        </p>
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
                        rows={filteredpurchaseDetail.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={purchaseDetails.links} />
                </Card.CardBody>

                {showCreateModal && (
                    <Create showModal={showCreateModal} setShowModal={setShowCreateModal} purchaseId={purchase.id} />
                )}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        purchaseDetail={showUpdateModal.purchaseDetail}
                    />
                )}
                <Confirm
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                    onDelete={handleConfirmDelete}
                    dataType="purchase order detail"
                />
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Purchase Order Detail Page" />;

export default Index;

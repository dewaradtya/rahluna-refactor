import MainLayout from '../../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../../../Components/Table';
import Pagination from '../../../../Components/Pagination';
import SplitButton from '../../../../Components/Button/SplitButton';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import { FaArrowLeft, FaDollarSign, FaDownload, FaFile, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../../utils';
import Card from '../../../../Components/Card';
import Confirm from '../../../../Components/Confirm/Confirm';
import PengurangHarga from './PengurangHarga';

const Index = ({ invoice, invoiceDetail }) => {
    const [showPengurangModal, setShowPengurangModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, invoiceDetail: null });
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
            router.delete(`/transaksi/invoiceJual/detail/${itemToDelete}`, {
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

    const handleEditButton = (invoiceDetail) => {
        setShowUpdateModal({ modal: true, invoiceDetail: invoiceDetail });
    };

    const handleDownloadPdf = () => {
        if (invoice && invoice.id) {
            window.open(`/invoice/${invoice.id}/pdf`, '_blank');
        }
    };

    const filteredinvoiceDetail = invoiceDetail.data.filter(
        (invoiceDetail) =>
            invoiceDetail.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoiceDetail.price.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Produk / Paket',
                name: 'product',
                renderCell: (row) => row.product.name
            },
            {
                label: 'Qty',
                name: 'qty',
                renderCell: (row) => row.qty
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: (row) => rupiah(row.purchase_price)
            },
            {
                label: 'Harga Jual',
                name: 'price',
                renderCell: (row) => rupiah(row.price)
            },
            {
                label: 'Total Harga (Beli)',
                name: 'total_purchase',
                renderCell: (row) => rupiah(row.purchase_price * row.qty)
            },
            {
                label: 'Total Harga (Jual)',
                name: 'total_sell',
                renderCell: (row) => rupiah(row.price * row.qty)
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
        const totalAmount = invoiceDetail.data.reduce((acc, { price, qty }) => {
            return acc + (Number(price) * Number(qty) || 0);
        }, 0);

        return {
            Total: rupiah(totalAmount)
        };
    }, [invoiceDetail]);

    const footerColumns = [{ key: 'Total', label: 'Total Semua' }];

    return (
        <>
            <Card>
                <Card.CardHeader titleText="Detail Invoice Jual" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton color="dark" text="Testing Print" icon={<FaFile />} onClick={handleDownloadPdf} />
                            <SplitButton color="danger" text="Print Kwitansi" icon={<FaDownload />} onClick={handleDownloadPdf} />
                            <SplitButton color="success" text="Print Invoice" icon={<FaDownload />} onClick={handleDownloadPdf} />
                            <SplitButton
                                color="info"
                                text="Pengurang Harga"
                                icon={<FaDollarSign />}
                                onClick={() => setShowPengurangModal(true)}
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <p className="fw-bold mb-0">
                            Nama Project:{' '}
                            <span className="fw-normal">{invoice ? `${invoice.nama_invoice}` : 'No project Selected'}</span>
                        </p>
                        <p className="fw-bold mb-0">
                            Customer:{' '}
                            <span className="fw-normal">
                                {invoice?.customer ? invoice.customer.name : 'No customer Selected'}
                            </span>
                        </p>
                        <p className="fw-bold mb-0">
                            Jatuh Tempo::{' '}
                            <span className="fw-normal">{invoice ? `${invoice.due_date}` : 'No invoice Selected'}</span>
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
                        rows={filteredinvoiceDetail.slice(0, entriesPerPage)}
                        footer={totals}
                        footerColumns={footerColumns}
                    />
                    <Pagination links={invoiceDetail.links} />
                </Card.CardBody>

                {showPengurangModal && (
                    <PengurangHarga
                        showModal={showPengurangModal}
                        setShowModal={setShowPengurangModal}
                        invoice={invoice}
                        invoiceId={invoice.id}
                    />
                )}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        invoiceDetail={showUpdateModal.invoiceDetail}
                    />
                )}
                <Confirm
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                    onDelete={handleConfirmDelete}
                    dataType="invoice order detail"
                />
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Invoice Jual Detail Page" />;

export default Index;

import MainLayout from '../../../../Layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import Table from '../../../../Components/Table';
import Pagination from '../../../../Components/Pagination';
import SplitButton from '../../../../Components/Button/SplitButton';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import { FaDollarSign, FaDownload, FaFile } from 'react-icons/fa';
import { formatDate, rupiah } from '../../../../utils';
import Card from '../../../../Components/Card';
import PengurangHarga from './PengurangHarga';
import Update from './Update';

const Index = ({ invoice, invoiceDetail, products }) => {
    const [showPengurangModal, setShowPengurangModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, invoiceDetail: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEditButton = (invoiceDetail) => {
        setShowUpdateModal({ modal: true, invoiceDetail: invoiceDetail });
    };

    const handleDownloadPdf = () => {
        if (invoice && invoice.id) {
            window.open(`/transaksi/invoiceJual/detail/${invoice.id}/pdf`, '_blank');
        }
    };

    const handleKwitansi = () => {
        if (invoice && invoice.id) {
            window.open(`/transaksi/invoiceJual/detail/${invoice.id}/kwitansi`, '_blank');
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
                label: 'Satuan',
                name: 'satuan',
                renderCell: (row) => row.product.unit
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
                label: 'Total Harga',
                name: 'total_sell',
                renderCell: (row) => rupiah(row.price * row.qty)
            },
            {
                label: 'Disc',
                name: 'discount',
                renderCell: (row) => (row.discount ? `${row.discount}%` : '0%')
            },
            {
                label: 'PPN',
                name: 'nilai_ppn',
                renderCell: (row) => rupiah(row.nilai_ppn)
            },
            {
                label: 'Total Sub After Disc',
                name: 'after_disc',
                renderCell: (row) => {
                    const discountAmount = row.price * row.qty * (row.discount / 100);
                    const totalAfterDiscount = row.price * row.qty - discountAmount;
                    const totalWithPPN = totalAfterDiscount + row.nilai_ppn;
                    return rupiah(totalWithPPN);
                }
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleEditButton(row)}
                            text="edit"
                            color="warning"
                            disabled={loadingButton !== null}
                        />
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
                            <SplitButton
                                color="danger"
                                text="Print Kwitansi"
                                icon={<FaDownload />}
                                onClick={handleKwitansi}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '10px' : '0px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
                            />
                            <SplitButton
                                color="success"
                                text="Print Invoice"
                                icon={<FaDownload />}
                                onClick={handleDownloadPdf}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '50px' : '0px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
                            />
                            <SplitButton
                                color="info"
                                text="Pengurang Harga"
                                icon={<FaDollarSign />}
                                onClick={() => setShowPengurangModal(true)}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '90px' : '0px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
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
                            Jatuh Tempo:{' '}
                            <span className="fw-normal">{invoice ? formatDate(invoice.due_date) : 'No invoice Selected'}</span>
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
                    <Pagination
                        links={invoiceDetail.links}
                        currentPage={invoiceDetail.current_page}
                        totalEntries={invoiceDetail.total}
                        perPage={invoiceDetail.per_page}
                    />
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
                        products={products}
                        invoiceDetail={showUpdateModal.invoiceDetail}
                    />
                )}
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Invoice Jual Detail Page" />;

export default Index;

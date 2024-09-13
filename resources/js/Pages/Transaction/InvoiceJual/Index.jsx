import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import Card from '../../../Components/Card';
import SplitButton from '../../../Components/Button/SplitButton';
import { MdOutlineDoneOutline } from 'react-icons/md';
import { GrInProgress } from 'react-icons/gr';
import Menu from './Menu';
import { rupiah } from '../../../utils';
import Update from './Update';
import Pay from './Pay';

const Index = ({ invoiceJual }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [isLunas, setIsLunas] = useState(false);
    const [selectedInvoiceJual, setSelectedInvoiceJual] = useState(null);
    const [showModalMenu, setShowModalMenu] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, invoiceJual: null });
    const [showModalPay, setShowModalPay] = useState({ modal: false, invoiceJual: null });

    const handleEditButton = (invoiceJual) => {
        setShowModalUpdate({ modal: true, invoiceJual: invoiceJual });
    };

    const handlePayButton = (invoiceJual) => {
        setShowModalPay({ modal: true, invoiceJual: invoiceJual });
    };

    const filteredInvoices = invoiceJual.data.filter((invoice) => {
        const remainingAmount = invoice.total_nilai - invoice.total_bayar;
        const matchesSearchTerm = invoice.nama_invoice.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearchTerm && (isLunas ? remainingAmount <= 0 : remainingAmount > 0);
    });

    const columns = useMemo(
        () => [
            {
                label: 'No. Invoice',
                name: 'id',
                renderCell: (row) => (
                    <p
                        className="text-danger"
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setSelectedInvoiceJual(row);
                            setShowModalMenu(true);
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        {row.referensi}
                    </p>
                )
            },
            {
                label: 'No. Kwitansi',
                name: 'kwitansi',
                renderCell: (row) => row.kwitansi
            },
            {
                label: 'Customer',
                name: 'customer',
                renderCell: (row) => row.customer.name
            },
            {
                label: 'Nama Invoice',
                name: 'nama_invoice',
                renderCell: (row) => row.nama_invoice
            },
            {
                label: 'Nilai Invoice',
                name: 'total_nilai',
                renderCell: (row) =>  rupiah(row.totalinvoice)
            },
            {
                label: 'PPN',
                name: 'ppn',
                renderCell: (row) => rupiah(row.nilai_ppn)
            },
            {
                label: 'Discount',
                name: 'discount',
                renderCell: (row) => row.discount + '%' || 0
            },
            {
                label: 'Jatuh Tempo',
                name: 'due_date',
                renderCell: (row) => row.due_date
            },
            {
                label: 'Tanggal Dibuat',
                name: 'tanggal_dibuat',
                renderCell: (row) => row.tanggal_dibuat
            },
            {
                label: 'Nilai Kurang Bayar',
                name: 'remaining_amount',
                renderCell: (row) => {
                    const remaining = row.totalinvoice - row.total_bayar + row.nilai_ppn;
                    return rupiah(remaining);
                }
            }
        ],
        [isLunas]
    );

    const handleSwitchButton = () => {
        setIsLunas((prev) => !prev);
    };

    const buttonColor = isLunas ? 'danger' : 'success';
    const buttonText = isLunas ? 'Inv Berlangsung' : 'Inv Lunas';
    const buttonIcon = isLunas ? <GrInProgress /> : <MdOutlineDoneOutline />;

    return (
        <Card>
            <Card.CardHeader
                titleText="Table Invoice Jual"
                rightComponent={
                    <SplitButton color={buttonColor} text={buttonText} icon={buttonIcon} onClick={handleSwitchButton} />
                }
            />

            <Card.CardBody>
                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />

                <Table columns={columns} rows={filteredInvoices.slice(0, entriesPerPage)} />
                <Pagination links={invoiceJual.links} />
            </Card.CardBody>
            {showModalMenu && (
                <Menu
                    showModal={showModalMenu}
                    setShowModal={setShowModalMenu}
                    invoiceJual={selectedInvoiceJual}
                    onEdit={handleEditButton}
                    onPay={handlePayButton}
                />
            )}
            {showModalUpdate.modal && (
                <Update
                    showModal={showModalUpdate.modal}
                    setShowModal={setShowModalUpdate}
                    invoiceJual={showModalUpdate.invoiceJual}
                />
            )}

            {showModalPay.modal && (
                <Pay
                    showModal={showModalPay.modal}
                    setShowModal={setShowModalPay}
                    invoiceJual={showModalPay.invoiceJual}
                    invoiceJualId={invoiceJual.id}
                />
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Invoice Jual Page" />;

export default Index;

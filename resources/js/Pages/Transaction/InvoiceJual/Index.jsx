import React, { useMemo, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import Card from '../../../Components/Card';
import SplitButton from '../../../Components/Button/SplitButton';
import { MdOutlineDoneOutline } from 'react-icons/md';
import { GrInProgress } from 'react-icons/gr';

const Index = ({ invoiceJual }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [isLunas, setIsLunas] = useState(false);

    const filteredInvoices = invoiceJual.data.filter(
        (invoice) =>
            invoice.nama_invoice.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (isLunas ? invoice.isLunas : !invoice.isLunas)
    );

    const columns = useMemo(
        () => [
            {
                label: 'No. Invoice',
                name: 'id',
                renderCell: (row) => row.id
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
                renderCell: (row) => row.total_nilai
            },
            {
                label: 'PPN',
                name: 'ppn',
                renderCell: (row) => row.ppn
            },
            {
                label: 'Discount',
                name: 'discount',
                renderCell: (row) => row.discount
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
                renderCell: (row) => row.total_nilai - row.total_bayar
            }
        ],
        [isLunas]
    );

    const handleSwitchButton = () => {
        setIsLunas((prev) => !prev);
    };

    const buttonColor = isLunas ? 'danger' : 'success' ;
    const buttonText = isLunas ? 'Inv Berlangsung' : 'Inv Lunas';
    const buttonIcon = isLunas ? <GrInProgress /> : < MdOutlineDoneOutline  />;

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
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Invoice Jual Page" />;

export default Index;

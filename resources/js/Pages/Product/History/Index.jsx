import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import { Link, router } from '@inertiajs/react';
import { rupiah } from '../../../utils';
import Card from '../../../Components/Card';
import { FaArrowUp, FaArrowDown, FaHourglass } from 'react-icons/fa';

const Index = ({ histories }) => {
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const filteredProductsHistory = histories.data.filter(
        (history) =>
            (history.product.name && history.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (history.price && history.price.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (history.status && history.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal/Waktu',
                name: 'first_create',
                renderCell: (row) => (row.first_create)
            },
            {
                label: 'Nama Produk',
                name: 'product.name',
                renderCell: (row) => (
                    <Link href={`/products/history/${row.id}`}>
                        {row.product.name}
                    </Link>
                )
            },
            {
                label: 'QTY',
                name: 'qty'
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
                label: 'Total',
                name: 'total',
                renderCell: (row) => rupiah(row.price * row.qty)
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => (
                    <span className="flex items-center">
                        {row.status}
                        {row.status.toLowerCase() === 'stok awal' || row.status.toLowerCase() === 'tambah stok' ? (
                            <FaArrowUp className="ml-2 text-success" />
                        ) : row.status.toLowerCase() === 'pending' ? (
                            <FaHourglass className="ml-2 text-warning" />
                        ) : (
                            <FaArrowDown className="ml-2 text-danger" />
                        )}
                    </span>
                )
            }
        ],
        [loadingButton]
    );

    const footer = useMemo(() => {
        const totalPembelian = histories.data.reduce((total, row) => {
            if (row.status.toLowerCase() === 'stok awal' || row.status.toLowerCase() === 'tambah stok') {
                return total + row.price * row.qty;
            }
            return total;
        }, 0);

        const totalPenjualan = histories.data.reduce((total, row) => {
            if (row.status.toLowerCase() === 'stok terpakai') {
                return total + row.price * row.qty;
            }
            return total;
        }, 0);

        return {
            total_pembelian: rupiah(totalPembelian),
            total_penjualan: rupiah(totalPenjualan),
        };
    }, [histories]);

    const footerColumns = [
        { key: 'total_penjualan', label: 'Total Penjualan' },
        { key: 'total_pembelian', label: 'Total Pembelian' }
    ];

    return (
        <Card>
            <Card.CardHeader titleText="Table History Produk" />
            <Card.CardBody>
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table columns={columns} rows={filteredProductsHistory.slice(0, entriesPerPage)} footer={footer} footerColumns={footerColumns} />
                <Pagination links={histories.links} />
            </Card.CardBody>
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product History Page" />;

export default Index;

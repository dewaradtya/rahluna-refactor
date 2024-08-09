import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import { router } from '@inertiajs/react';
import { rupiah, formatDate } from '../../../utils';
import Card from '../../../Components/Card';
import SplitButton from '../../../Components/Button/SplitButton';
import { FaArrowDown, FaArrowLeft, FaArrowUp, FaHourglass } from 'react-icons/fa';

const Show = ({ history }) => {
    const [loadingButton, setLoadingButton] = useState(null);

    const handleBackButton = () => {
        router.get('/products/history', {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal/Waktu',
                name: 'first_create',
                renderCell: () => (history.first_create)
            },
            {
                label: 'Nama Produk',
                name: 'product.name',
                renderCell: () => (history.product ? history.product.name : 'N/A')
            },
            {
                label: 'QTY',
                name: 'qty',
                renderCell: () => history.qty
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: () => rupiah(history.purchase_price)
            },
            {
                label: 'Harga Jual',
                name: 'price',
                renderCell: () => rupiah(history.price)
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
        [history]
    );

    const footer = useMemo(
        () => ({
            purchase_price: rupiah(history.purchase_price * history.qty),
            price: rupiah(history.price * history.qty)
        }),
        [history]
    );

    const footerColumns = [
        { key: 'price', label: 'Total Penjualan' },
        { key: 'purchase_price', label: 'Total Pembelian' }
    ];

    return (
        <Card>
            <Card.CardHeader
                titleText="Table History Produk"
                rightComponent={
                    <SplitButton
                        color="danger"
                        text="Semua History"
                        icon={<FaArrowLeft />}
                        onClick={() => handleBackButton(true)}
                    />
                }
            />
            <Card.CardBody>
                <Table columns={columns} rows={[history]} footer={footer} footerColumns={footerColumns} />
            </Card.CardBody>
        </Card>
    );
};

Show.layout = (page) => <MainLayout children={page} title="Product History" />;

export default Show;

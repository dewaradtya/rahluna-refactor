import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import { router } from '@inertiajs/react';
import { rupiah } from '../../../utils';
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
                renderCell: () => history.first_create
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
                label: 'Total',
                name: 'total',
                renderCell: () => rupiah(history.price * history.qty)
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => (
                    <span className="flex items-center">
                        {history.status}
                        {history.status.toLowerCase() === 'stok awal' || history.status.toLowerCase() === 'tambah stok' ? (
                            <FaArrowUp className="ml-2 text-success" />
                        ) : history.status.toLowerCase() === 'pending' ? (
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

    const footer = useMemo(() => {
        let totalPembelian = 0;
        let totalPenjualan = 0;

        if (history.status.toLowerCase() === 'stok awal' || history.status.toLowerCase() === 'tambah stok') {
            totalPembelian = history.purchase_price * history.qty;
        } else if (history.status.toLowerCase() === 'stok terpakai') {
            totalPenjualan = history.price * history.qty;
        }

        return {
            total_pembelian: rupiah(totalPembelian),
            total_penjualan: rupiah(totalPenjualan),
        };
    }, [history]);

    const footerColumns = [
        { key: 'total_penjualan', label: 'Total Penjualan' },
        { key: 'total_pembelian', label: 'Total Pembelian' }
    ];

    return (
        <Card>
            <Card.CardHeader
                titleText="Table History Produk"
                additionalInfo={history.product ? `${history.product.name}` : 'No Product Selected'}
                rightComponent={
                    <SplitButton
                        color="danger"
                        text="Semua History"
                        icon={<FaArrowLeft />}
                        onClick={handleBackButton}
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

import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import { router, Link } from '@inertiajs/react';
import { rupiah, formatDate } from '../../../utils';
import Card from '../../../Components/Card';
import SplitButton from '../../../Components/Button/SplitButton';
import { FaArrowLeft } from 'react-icons/fa';

const Show = ({ suratJalan }) => {
    const [loadingButton, setLoadingButton] = useState(null);

    const handleBackButton = () => {
        router.get('/transaksi/suratJalan', {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const columns = useMemo(
        () => [
            {
                label: 'Nama Customer',
                name: 'customer_name',
                renderCell: (row) => row.customer?.name || 'N/A'
            },
            {
                label: 'No Surat',
                name: 'no_surat',
                renderCell: (row) => row.no_surat
            },
        ],
        [suratJalan]
    );

    return (
        <Card>
            <Card.CardHeader
                titleText="Detail Surat Jalan"
                rightComponent={
                    <SplitButton
                        color="danger"
                        text="Kembali ke Surat Jalan"
                        icon={<FaArrowLeft />}
                        onClick={handleBackButton}
                    />
                }
            />
            <Card.CardBody>
                <Table columns={columns} rows={[suratJalan]} />
            </Card.CardBody>
        </Card>
    );
};

Show.layout = (page) => <MainLayout children={page} title="Detail Surat Jalan" />;

export default Show;

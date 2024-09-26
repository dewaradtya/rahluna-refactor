import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import Card from '../../../Components/Card';

const Index = ({ customers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const filteredCustomers = customers.data.filter((customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const columns = useMemo(
        () => [
            {
                label: 'Nama CV / Industri',
                name: 'name',
                renderCell: (row) => <Link href={`/transaksi/suratJalan/${row.id}`}>{row.name}</Link>
            }
        ],
        []
    );

    return (
        <Card>
            <Card.CardHeader titleText="Table Surat Jalan" />
            <Card.CardBody>
                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />

                <Table columns={columns} rows={filteredCustomers.slice(0, entriesPerPage)} />
                <Pagination
                    links={customers.links}
                    currentPage={customers.current_page}
                    totalEntries={customers.total}
                    perPage={customers.per_page}
                />
            </Card.CardBody>
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Surat Jalan Page" />;

export default Index;

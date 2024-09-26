import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import BadgeLink from '../../Components/Link/BadgeLink';
import { router } from '@inertiajs/react';
import Card from '../../Components/Card';

const Index = ({ userRoles }) => {
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const handleDeleteButton = (id) => {
        router.delete(`/menu/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const filteredUserRoles = useMemo(() => {
        return userRoles.data.filter((userRole) => userRole.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [userRoles.data, searchTerm]);

    const columns = useMemo(
        () => [
            {
                label: 'Role',
                name: 'name'
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeLink text="edit" color="warning" href={`/role/${row.slug}`} disabled={loadingButton !== null} />
                    </>
                )
            }
        ],
        [loadingButton]
    );

    return (
        <>
            <Card>
                <Card.CardHeader titleText="Table Role" />

                <Card.CardBody>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table columns={columns} rows={filteredUserRoles.slice(0, entriesPerPage)} />
                    <Pagination
                        links={userRoles.links}
                        currentPage={userRoles.current_page}
                        totalEntries={userRoles.total}
                        perPage={userRoles.per_page}
                    />
                </Card.CardBody>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

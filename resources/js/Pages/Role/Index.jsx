import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeLink from '../../Components/Link/BadgeLink';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';

const Index = ({ userRoles }) => {
    const [loadingButton, setLoadingButton] = useState(null);

    const handleDeleteButton = (id) => {
        router.delete(`/menu/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

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
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Role</h1>
            </div>

            <div className="row">
                <div className="col-6">
                    <Table columns={columns} rows={userRoles} />
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../Components/Table';
import { router } from '@inertiajs/react';
import { InputCheckbox } from '../../Components/FieldInput';

const Index = ({ menus, userRole }) => {
    const [loadingButton, setLoadingButton] = useState(null);

    const handleChangeAccess = (user_role_id, menu_id) => {
        router.post(
            `/role/change-access`,
            {
                user_role_id,
                menu_id
            },
            {
                preserveScroll: true
            }
        );
    };

    const columns = useMemo(
        () => [
            {
                label: 'Menu',
                name: 'menu'
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <InputCheckbox
                            id={row.id}
                            label={row.user_access_is_active ? 'aktif' : 'tidak aktif'}
                            checked={row.user_access_is_active}
                            onChange={() => handleChangeAccess(userRole.id, row.id)}
                        />
                    </>
                )
            }
        ],
        [loadingButton]
    );

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Role Detail</h1>
            </div>

            <div className="row">
                <div className="col-6">
                    <Table columns={columns} rows={menus} />
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../Components/Table';
import { router } from '@inertiajs/react';
import { InputCheckbox } from '../../Components/FieldInput';
import Card from '../../Components/Card';
import { FaArrowLeft } from 'react-icons/fa';
import SplitButton from '../../Components/Button/SplitButton';

const Index = ({ menus, userRole }) => {
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

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

    const handleBackButton = () => {
        router.get('/role');
    };

    const filteredMenus = menus.filter((menu) =>
        menu.menu.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Card>
                <Card.CardHeader
                    titleText={`Detail Role ${userRole.name}`}
                    rightComponent={
                        <SplitButton color="danger" text="Kembali" icon={<FaArrowLeft />} onClick={() => handleBackButton(true)} />
                    }
                />
                <Card.CardBody>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />
                    <Table columns={columns} rows={filteredMenus.slice(0, entriesPerPage)} />
                </Card.CardBody>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

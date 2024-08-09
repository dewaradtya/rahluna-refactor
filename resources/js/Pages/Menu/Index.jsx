import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';

const Index = ({ menus, groupMenus }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, menu: null });
    const [loadingButton, setLoadingButton] = useState(null);

    const handleEditButton = (menu) => {
        setShowUpdateModal({ modal: true, menu: menu });
    };

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
                label: 'Menu',
                name: 'menu'
            },
            {
                label: 'Url',
                name: 'url'
            },
            {
                label: 'Ikon',
                name: 'icon'
            },
            {
                label: 'Grup Menu',
                name: 'group_menu'
            },
            {
                label: 'Menu Utama',
                name: 'main_menu'
            },
            {
                label: 'Aktif',
                name: 'is_active',
                renderCell: (row) => (row.is_active ? 'Aktif' : 'Non Aktif')
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleDeleteButton(row.id)}
                            text={`${loadingButton === row.id ? 'loading...' : 'hapus'}`}
                            color="danger"
                            disabled={loadingButton !== null}
                        />
                        <BadgeButton
                            onClick={() => handleEditButton(row)}
                            text="edit"
                            color="warning"
                            disabled={loadingButton !== null}
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
                <h1 className="h3 mb-0 text-gray-800">Menu</h1>

                <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
            </div>

            <Table columns={columns} rows={menus.data} />
            <Pagination links={menus.links} />

            {showCreateModal && (
                <Create
                    showModal={showCreateModal}
                    setShowModal={setShowCreateModal}
                    menus={menus.data}
                    groupMenus={groupMenus}
                />
            )}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    dataMenu={showUpdateModal.menu}
                    menus={menus.data}
                    groupMenus={groupMenus}
                />
            )}
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import Card from '../../Components/Card';
import Confirm from '../../Components/Confirm/Confirm';

const Index = ({ menus, groupMenus }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, menu: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/menu/${itemToDelete}`, {
                preserveScroll: true,
                onStart: () => setLoadingButton(itemToDelete),
                onFinish: () => {
                    setLoadingButton(null);
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },

                onError: () => {
                    setLoadingButton(null);
                    setShowDeleteModal(false);
                }
            });
        }
    };

    const handleEditButton = (menu) => {
        setShowUpdateModal({ modal: true, menu: menu });
    };

    const filteredMenus = menus.data.filter((menu) => menu.menu.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <Card>
                <Card.CardHeader titleText="Menu" />
                <Card.CardBody>
                    <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />

                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />
                    <Table columns={columns} rows={filteredMenus.slice(0, entriesPerPage)} />
                    <Pagination links={menus.links} />
                </Card.CardBody>
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
                <Confirm showModal={showDeleteModal} setShowModal={setShowDeleteModal} onDelete={handleConfirmDelete} dataType="menu"/>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Menu Page" />;

export default Index;

import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import Card from '../../Components/Card';
import Confirm from '../../Components/Confirm/Confirm';

const Index = ({ units }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, unit: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/units/${itemToDelete}`, {
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

    const handleEditButton = (unit) => {
        setShowUpdateModal({ modal: true, unit: unit });
    };

    const filteredUnit = units.data.filter((unit) => unit.name.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    const columns = useMemo(
        () => [
            {
                label: 'Nama Satuan',
                name: 'name'
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
                <Card.CardHeader titleText="Table Satuan" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="primary"
                                text="Satuan Baru"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '10px' : '0px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
                            />
                        </div>
                    </div>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table columns={columns} rows={filteredUnit.slice(0, entriesPerPage)} />
                    <Pagination
                        links={units.links}
                        currentPage={units.current_page}
                        totalEntries={units.total}
                        perPage={units.per_page}
                    />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update showModal={showUpdateModal.modal} setShowModal={setShowUpdateModal} unit={showUpdateModal.unit} />
                )}
                <Confirm
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                    onDelete={handleConfirmDelete}
                    dataType="unit"
                />
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Page" />;

export default Index;

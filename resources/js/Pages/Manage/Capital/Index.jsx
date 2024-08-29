import MainLayout from '../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { formatDate, rupiah } from '../../../utils';
import Card from '../../../Components/Card';
import Confirm from '../../../Components/Confirm/Confirm';

const Index = ({ capitals }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, capital: null });
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
            router.delete(`/modal/${itemToDelete}`, {
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

    const handleEditButton = (capital) => {
        setShowUpdateModal({ modal: true, capital: capital });
    };

    const filteredCapital = capitals.data.filter(
        (capital) =>
            capital.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            capital.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Asal Modal',
                name: 'origin'
            },
            {
                label: 'Nilai',
                name: 'amount',
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Tanggal Perolehan',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
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
                <Card.CardHeader titleText="Table Modal" />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="primary"
                                text="Modal Baru"
                                icon={<FaPlus />}
                                onClick={() => setShowCreateModal(true)}
                            />
                        </div>
                    </div>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table columns={columns} rows={filteredCapital.slice(0, entriesPerPage)} />
                    <Pagination links={capitals.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        capital={showUpdateModal.capital}
                    />
                )}
                <Confirm showModal={showDeleteModal} setShowModal={setShowDeleteModal} onDelete={handleConfirmDelete} dataType="capital"/>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Modal Page" />;

export default Index;

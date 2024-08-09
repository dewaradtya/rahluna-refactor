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

const Index = ({ units }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, unit: null });
    const [loadingButton, setLoadingButton] = useState(null);

    const handleEditButton = (unit) => {
        setShowUpdateModal({ modal: true, unit: unit });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/units/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

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
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Satuan</h1>

                <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
            </div>

            <Table columns={columns} rows={units.data} />
            <Pagination links={units.links} />

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
            {showUpdateModal.modal && (
                <Update showModal={showUpdateModal.modal} setShowModal={setShowUpdateModal} unit={showUpdateModal.unit} />
            )}
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Page" />;

export default Index;

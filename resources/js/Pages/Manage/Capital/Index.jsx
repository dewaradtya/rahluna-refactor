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

const Index = ({ capitals }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, capital: null });
    const [loadingButton, setLoadingButton] = useState(null);

    const handleEditButton = (capital) => {
        setShowUpdateModal({ modal: true, capital: capital });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/modal/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

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
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Modal</h1>

                <SplitButton color="primary" text="Tambah" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
            </div>

            <Table columns={columns} rows={capitals.data} />
            <Pagination links={capitals.links} />

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
            {showUpdateModal.modal && (
                <Update showModal={showUpdateModal.modal} setShowModal={setShowUpdateModal} capital={showUpdateModal.capital} />
            )}
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Modal Page" />;

export default Index;

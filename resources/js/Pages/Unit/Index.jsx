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
import Card from '../../Components/Card';

const Index = ({ units }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, unit: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

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

    const filteredUnit = units.data.filter(
        (unit) =>
            unit.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            />
                        </div>
                    </div>
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table
                        columns={columns}
                        rows={filteredUnit.slice(0, entriesPerPage)}
                    />
                    <Pagination links={units.links} />
                </Card.CardBody>

                {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
                {showUpdateModal.modal && (
                    <Update
                        showModal={showUpdateModal.modal}
                        setShowModal={setShowUpdateModal}
                        unit={showUpdateModal.unit}
                    />
                )}
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Page" />;

export default Index;

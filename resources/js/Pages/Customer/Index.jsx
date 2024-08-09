import React, { useMemo, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import { FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import Card from '../../Components/Card';
import Modal from '../../Components/Modal';  

const Index = ({ customers }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, customer: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [imageModal, setImageModal] = useState({ visible: false, src: '' });

    const handleEditButton = (customer) => {
        setShowModalUpdate({ modal: true, customer });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/customer/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const handleImageModalOpen = (imageSrc) => {
        setImageModal({ visible: true, src: imageSrc });
    };

    const handleImageModalClose = () => {
        setImageModal({ visible: false, src: '' });
    };

    const filteredCustomers = customers.data.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.pic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.telp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Nama',
                name: 'name'
            },
            {
                label: 'PIC',
                name: 'pic'
            },
            {
                label: 'No. Telepon',
                name: 'telp'
            },
            {
                label: 'Aksi',
                name: 'aksi',
                rowSpan: 2,
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
                        {row.identity && (
                            <BadgeButton
                                onClick={() => handleImageModalOpen(row.identity)}
                                text="lihat bukti"
                                color="dark"
                                disabled={loadingButton !== null}
                            />
                        )}
                    </>
                )
            }
        ],
        [loadingButton]
    );

    return (
        <Card>
            <Card.CardHeader titleText="Table Customer" />
            <Card.CardBody>
                <SplitButton color="primary" text="Add Customer" icon={<FaPlus />} onClick={() => setShowModalCreate(true)} />
                
                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                
                <Table columns={columns} rows={filteredCustomers.slice(0, entriesPerPage)} />
                <Pagination links={customers.links} />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} />}
            {showModalUpdate.modal && (
                <Update showModal={showModalUpdate.modal} setShowModal={setShowModalUpdate} customer={showModalUpdate.customer} />
            )}
            {imageModal.visible && (
                <Modal title="Bukti" showModal={imageModal.visible} setShowModal={handleImageModalClose}>
                    <Modal.Body>
                        <img src={imageModal.src} alt="Bukti" className="w-full" />
                    </Modal.Body>
                </Modal>
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Customer Page" />;

export default Index;

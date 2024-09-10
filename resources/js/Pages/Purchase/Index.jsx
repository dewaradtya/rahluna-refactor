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
import Confirm from '../../Components/Confirm/Confirm';
import { formatDate, rupiah } from '../../utils';
import Menu from './Menu';

const Index = ({ purchase, project }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalMenu, setShowModalMenu] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, purchase: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [imageModal, setImageModal] = useState({ visible: false, src: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/purchase/${itemToDelete}`, {
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

    const handleEditButton = (purchase) => {
        setShowModalUpdate({ modal: true, purchase });
    };

    const handleImageModalOpen = (imageSrc) => {
        setImageModal({ visible: true, src: imageSrc });
    };

    const handleImageModalClose = () => {
        setImageModal({ visible: false, src: '' });
    };

    const filteredpurchase = purchase.data.filter(
        (purchase) =>
            purchase.referensi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.project?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'No. Referensi',
                name: 'referensi',
                renderCell: (row) => (
                    <p
                        className="text-danger"
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setSelectedPurchase(row);
                            setShowModalMenu(true);
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        {row.referensi}
                    </p>
                )
            },
            {
                label: 'Project',
                name: 'project',
                renderCell: (row) => {
                    return row.project?.name || 'N/A';
                }
            },
            {
                label: 'Nilai P.O',
                name: 'nilai_po',
                renderCell: (row) => {
                    const discount = row.discount || 0;
                    const finalValue = row.total_value - (row.total_value * (discount / 100));
                    return rupiah(finalValue);
                }
            },
            {
                label: 'Discount',
                name: 'discount',
                renderCell: (row) => (row.discount + '%' || 0)

            },
            {
                label: 'Delivery Date',
                name: 'delivery_date',
                renderCell: (row) => formatDate(row.delivery_date)
            },
            {
                label: 'Tanggal Dibuat',
                name: 'date',
                renderCell: (row) => formatDate(row.date)
            }
        ],
        [loadingButton]
    );

    return (
        <Card>
            <Card.CardHeader titleText="Table Purchase Order" />
            <Card.CardBody>
                <SplitButton color="primary" text="New PO" icon={<FaPlus />} onClick={() => setShowModalCreate(true)} />

                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />

                <Table columns={columns} rows={filteredpurchase.slice(0, entriesPerPage)} />
                <Pagination links={purchase.links} />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} project={project} />}
            {showModalMenu && (
                <Menu
                    showModal={showModalMenu}
                    setShowModal={setShowModalMenu}
                    purchase={selectedPurchase}
                    onEdit={handleEditButton}
                />
            )}
            {showModalUpdate.modal && (
                <Update showModal={showModalUpdate.modal} setShowModal={setShowModalUpdate} purchase={showModalUpdate.purchase} />
            )}
            {imageModal.visible && (
                <Modal title="Bukti" showModal={imageModal.visible} setShowModal={handleImageModalClose}>
                    <Modal.Body>
                        <img src={imageModal.src} alt="Bukti" className="w-full" />
                    </Modal.Body>
                </Modal>
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="purchase order"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Purchase Order Page" />;

export default Index;

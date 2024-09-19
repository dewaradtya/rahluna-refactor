import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../../Layouts/MainLayout';
import Table from '../../../../Components/Table';
import { router } from '@inertiajs/react';
import Card from '../../../../Components/Card';
import SplitButton from '../../../../Components/Button/SplitButton';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import Pagination from '../../../../Components/Pagination';
import Create from './Create';
import PackageCreate from './PackageCreate';
import SuratJalanNew from './SuratjalanNew';
import Update from './Update';
import Confirm from '../../../../Components/Confirm/Confirm';
import { rupiah } from '../../../../utils';

const Index = ({ customer, suratJalan, products }) => {
    const [loadingButton, setLoadingButton] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuratJalanModal, setShowSuratJalanModal] = useState(false);
    const [showPaketModal, setShowPaketModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, suratJalan: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
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
            router.delete(`/transaksi/suratJalan/${itemToDelete}`, {
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

    const handleEditButton = (suratJalan) => {
        setShowUpdateModal({ modal: true, suratJalan });
    };

    const handleBackButton = () => {
        router.get('/transaksi/suratJalan', {
            preserveScroll: true,
            onStart: () => setLoadingButton(null),
            onFinish: () => setLoadingButton(null)
        });
    };

    const handleCheckboxChange = (rowId) => {
        setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
    };

    const filteredSuratJalan = suratJalan.data.filter(
        (product) =>
            product.surat_jalan_new_id === null &&
            (product.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.product?.model_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const columns = useMemo(
        () => [
            {
                label: '#',
                name: 'select',
                renderCell: (row) => (
                    <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(row.id)}
                        checked={selectedRows.includes(row.id)}
                    />
                ),
                className: 'text-center',
                width: '50px'
            },
            {
                label: 'Produk / Paket',
                name: 'product_package',
                renderCell: (row) => row.product?.name || 'N/A'
            },
            {
                label: 'Qty',
                name: 'qty',
                renderCell: (row) => row.qty || '0'
            },
            {
                label: 'Satuan',
                name: 'unit',
                renderCell: (row) => row.product?.unit || 'N/A'
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: (row) => rupiah(row.purchase_price)
            },
            {
                label: 'Total Harga',
                name: 'total_price',
                renderCell: (row) => rupiah(row.qty * row.purchase_price)
            },
            {
                label: 'Keterangan',
                name: 'note',
                renderCell: (row) => row.note || 'N/A'
            },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleDeleteButton(row.id)}
                            text={`${loadingButton === row.id ? 'Loading...' : 'Hapus'}`}
                            color="danger"
                            disabled={loadingButton !== null}
                        />
                        <BadgeButton
                            onClick={() => handleEditButton(row)}
                            text="Edit"
                            color="warning"
                            disabled={loadingButton !== null}
                        />
                    </>
                )
            }
        ],
        [loadingButton, selectedRows, filteredSuratJalan]
    );

    return (
        <Card>
            <Card.CardHeader
                titleText="Table Surat Jalan"
                additionalInfo={
                    customer ? `${customer.name} - ${customer.pic} - ${customer.telp} - ${customer.email}` : 'No Product Selected'
                }
                rightComponent={<SplitButton color="danger" text="Kembali" icon={<FaArrowLeft />} onClick={handleBackButton} />}
            />
            <Card.CardBody>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="primary"
                            text="Produk"
                            icon={<FaPlus />}
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '10px' : '5px',
                                right: '0px',
                                zIndex: 1000,
                                transition: 'position 0.3s ease, top 0.3s ease'
                            }}
                        />
                        <SplitButton
                            color="info"
                            text="Paket"
                            icon={<FaPlus />}
                            onClick={() => setShowPaketModal(true)}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '50px' : '5px',
                                right: '0px',
                                zIndex: 1000,
                                transition: 'position 0.3s ease, top 0.3s ease'
                            }}
                        />
                        <SplitButton
                            color="success"
                            text="Surat Jalan"
                            icon={<FaPlus />}
                            onClick={() => setShowSuratJalanModal(true)}
                            disabled={selectedRows.length === 0}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '90px' : '5px',
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
                <Table columns={columns} rows={filteredSuratJalan.slice(0, entriesPerPage)} />
                <Pagination links={suratJalan.links} />
            </Card.CardBody>
            {showCreateModal && (
                <Create
                    showModal={showCreateModal}
                    setShowModal={setShowCreateModal}
                    products={products}
                    customerId={customer.id}
                />
            )}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    products={products}
                    suratJalan={showUpdateModal.suratJalan}
                />
            )}
            {showPaketModal && (
                <PackageCreate
                    showModal={showPaketModal}
                    setShowModal={setShowPaketModal}
                    products={products}
                    customerId={customer.id}
                />
            )}
            {showSuratJalanModal && (
                <SuratJalanNew showModal={showSuratJalanModal} setShowModal={setShowSuratJalanModal} customerId={customer.id} />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="surat jalan"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Table Surat Jalan" />;

export default Index;

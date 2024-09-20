import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../../Layouts/MainLayout';
import Table from '../../../../Components/Table';
import { router } from '@inertiajs/react';
import Card from '../../../../Components/Card';
import SplitButton from '../../../../Components/Button/SplitButton';
import { FaArrowLeft, FaCheck, FaPlus } from 'react-icons/fa';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import Pagination from '../../../../Components/Pagination';
import Create from './Create';
import InvoiceModal from './InvoiceModal';
import PackageCreate from './PackageCreate';
import SuratJalanNew from './SuratjalanNew';
import Update from './Update';
import Confirm from '../../../../Components/Confirm/Confirm';
import { rupiah } from '../../../../utils';

const Index = ({ customer, suratJalan, suratJalanNew, products, productPackages }) => {
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
    const [selectedSuratJalanNewRows, setSelectedSuratJalanNewRows] = useState([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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

    const handleCheckboxChange = (rowId, isNew = false) => {
        if (isNew) {
            setSelectedSuratJalanNewRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
        } else {
            setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
        }
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

    const sortedSuratJalanNew = useMemo(() => {
        return [...suratJalanNew.data].sort((a, b) => {
            if (a.invoice_id && !b.invoice_id) return 1;
            if (!a.invoice_id && b.invoice_id) return -1;
            return 0;
        });
    }, [suratJalanNew]);

    const suratJalanNewColumns = useMemo(
        () => [
            {
                label: '#',
                name: 'select',
                renderCell: (row) => (
                    <div className="text-center">
                        {row.invoice_id != null ? (
                            <FaCheck color="green" />
                        ) : (
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(row.id, true)}
                                checked={selectedSuratJalanNewRows.includes(row.id)}
                            />
                        )}
                    </div>
                ),
                className: 'text-center',
                width: '50px'
            },
            { label: 'No. Surat', name: 'no_surat', renderCell: (row) => row.no_surat },
            { label: 'Tanggal Kirim', name: 'tanggal_kirim', renderCell: (row) => row.tanggal_kirim },
            {
                label: 'Aksi',
                name: 'aksi',
                renderCell: (row) => (
                    <>
                        <BadgeButton
                            onClick={() => handleDeleteButton(row.id)}
                            text="Hapus"
                            color="danger"
                            disabled={row.invoice_id != null}
                        />
                        <BadgeButton onClick={() => handleEditButton(row)} text="Edit" color="warning" />
                    </>
                )
            }
        ],
        [loadingButton, selectedSuratJalanNewRows, suratJalanNew]
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

                {/* Card for Surat Jalan */}
                <Card>
                    <Card.CardHeader titleText="Data Surat Jalan" />
                    <Card.CardBody>
                        <Table columns={columns} rows={filteredSuratJalan.slice(0, entriesPerPage)} />
                        <Pagination links={suratJalan.links} />
                    </Card.CardBody>
                </Card>

                {/* Card for Surat Jalan New */}
                <Card>
                    <Card.CardHeader titleText="Data Surat Jalan New" />
                    <Card.CardBody>
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="success"
                                text="Invoice"
                                icon={<FaPlus />}
                                onClick={() => setShowInvoiceModal(true)}
                                disabled={selectedSuratJalanNewRows.length === 0}
                            />
                        </div>
                        <Table columns={suratJalanNewColumns} rows={sortedSuratJalanNew} />
                        <Pagination links={suratJalanNew.links} />
                    </Card.CardBody>
                </Card>
            </Card.CardBody>

            {/* Modals */}
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
                    productPackages={productPackages}
                    customerId={customer.id}
                />
            )}
            {showSuratJalanModal && (
                <SuratJalanNew showModal={showSuratJalanModal} setShowModal={setShowSuratJalanModal} customerId={customer.id} />
            )}
            {showInvoiceModal && (
                <InvoiceModal
                    showModal={showInvoiceModal}
                    setShowModal={setShowInvoiceModal}
                    selectedRows={selectedSuratJalanNewRows}
                    customerId={customer.id}
                />
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

import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import { FaFile, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { rupiah } from '../../utils';
import UpdateStock from './UpdateStock';
import SplitButtonGroup from '../../Components/Button/SplitButtonGroup';
import ImportExcel from './ImportExcel';
import Card from '../../Components/Card';
import Confirm from '../../Components/Confirm/Confirm';

const Index = ({ products, units }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, product: null });
    const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
    const [showImportProductModal, setShowImportProductModal] = useState(false);
    const [loadingButton, setLoadingButton] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
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
            router.delete(`/products/${itemToDelete}`, {
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

    const handleEditButton = (product) => {
        setShowUpdateModal({ modal: true, product });
    };

    const handlePaketButton = () => {
        router.get('/products/package');
    };

    const filteredProducts = products.data.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Nama Produk',
                name: 'name'
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: (row) => rupiah(row.purchase_price)
            },
            {
                label: 'Harga Jual',
                name: 'price',
                renderCell: (row) => rupiah(row.price)
            },
            {
                label: 'Stok',
                name: 'stock'
            },
            {
                label: 'Satuan',
                name: 'unit'
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
        <Card>
            <Card.CardHeader titleText="Table Produk" />
            <Card.CardBody>
                <div className={`d-sm-flex align-items-center justify-content-between mb-2 ${isSticky ? 'sticky-header' : ''}`}>
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="primary"
                            text="Baru"
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
                        <SplitButton
                            color="info"
                            text="Paket"
                            icon={<FaPlus />}
                            onClick={handlePaketButton}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '50px' : '0px',
                                right: '0px',
                                zIndex: 1000,
                                transition: 'position 0.3s ease, top 0.3s ease'
                            }}
                        />
                        <SplitButton
                            color="warning"
                            text="Stok"
                            icon={<FaPlus />}
                            onClick={() => setShowUpdateStockModal(true)}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '90px' : '0px',
                                right: '0px',
                                zIndex: 1000,
                                transition: 'position 0.3s ease, top 0.3s ease'
                            }}
                        />
                        <SplitButtonGroup
                            color="success"
                            text="Import Excel"
                            icon={<FaFile />}
                            dropdownOpen={dropdownOpen}
                            setDropdownOpen={setDropdownOpen}
                            onClick={() => setShowImportProductModal(true)}
                            style={{
                                position: isSticky ? 'fixed' : 'relative',
                                top: isSticky ? '130px' : '0px',
                                right: '0px',
                                zIndex: 1000,
                                transition: 'position 0.3s ease, top 0.3s ease'
                            }}
                        >
                            <SplitButtonGroup.Link
                                href="/products/download-format"
                                dropdownOpen={dropdownOpen}
                                setDropdownOpen={setDropdownOpen}
                            >
                                Download Format
                            </SplitButtonGroup.Link>
                        </SplitButtonGroup>
                    </div>
                </div>
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table columns={columns} rows={filteredProducts.slice(0, entriesPerPage)} />
                <Pagination
                    links={products.links}
                    currentPage={products.current_page}
                    totalEntries={products.total}
                    perPage={products.per_page}
                />
            </Card.CardBody>

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} units={units} />}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    units={units}
                    product={showUpdateModal.product}
                />
            )}
            {showUpdateStockModal && (
                <UpdateStock showModal={showUpdateStockModal} setShowModal={setShowUpdateStockModal} products={products.data} />
            )}
            {showImportProductModal && (
                <ImportExcel showModal={showImportProductModal} setShowModal={setShowImportProductModal} />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="product"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Page" />;

export default Index;

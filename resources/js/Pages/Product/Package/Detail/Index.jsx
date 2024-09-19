import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../../Layouts/MainLayout';
import Create from './Create';
import Update from './Update';
import Table from '../../../../Components/Table';
import Pagination from '../../../../Components/Pagination';
import SplitButton from '../../../../Components/Button/SplitButton';
import BadgeButton from '../../../../Components/Button/BadgeButton';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { rupiah } from '../../../../utils';
import Card from '../../../../Components/Card';
import Confirm from '../../../../Components/Confirm/Confirm';

const Index = ({ productPackage, productPackageDetail, products }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, productPackageDetail: null });
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
            router.delete(`/products/package/detail/${itemToDelete}`, {
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

    const handleEditButton = (productPackageDetail) => {
        setShowUpdateModal({ modal: true, productPackageDetail });
    };

    const handleBackButton = () => {
        router.get('/products/package');
    };

    const filteredProductPackageDetail = productPackageDetail.data.filter(
        (detail) =>
            detail.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rupiah(productPackageDetail.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
            rupiah(productPackageDetail.purchase_price).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Nama Produk',
                name: 'name',
                renderCell: (row) => row.product?.name || 'N/A'
            },
            {
                label: 'Qty',
                name: 'qty'
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

    const footer = useMemo(
        () => ({
            price: rupiah(productPackageDetail.data.reduce((total, row) => total + row.price * row.qty, 0)),
            purchase_price: rupiah(productPackageDetail.data.reduce((total, row) => total + row.purchase_price * row.qty, 0))
        }),
        [productPackageDetail]
    );

    const footerColumns = [
        { key: 'purchase_price', label: 'Total harga beli' },
        { key: 'price', label: 'Total harga jual' }
    ];

    return (
        <Card>
            <Card.CardHeader
                className="custom-class"
                titleText="Table Detail Paket"
                additionalInfo={productPackage ? `${productPackage.name}` : 'No Package Selected'}
                rightComponent={
                    <SplitButton color="danger" text="Paket" icon={<FaArrowLeft />} onClick={() => handleBackButton(true)} />
                }
            />
            <Card.CardBody>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="primary"
                            text="Baru"
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
                    rows={filteredProductPackageDetail.slice(0, entriesPerPage)}
                    footer={footer}
                    footerColumns={footerColumns}
                />
                <Pagination links={productPackageDetail.links} />
            </Card.CardBody>

            {showCreateModal && (
                <Create
                    showModal={showCreateModal}
                    setShowModal={setShowCreateModal}
                    products={products}
                    productPackageId={productPackage.id}
                />
            )}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    products={products}
                    productPackageDetail={showUpdateModal.productPackageDetail}
                />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="package detail"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Package Detail Page" />;

export default Index;

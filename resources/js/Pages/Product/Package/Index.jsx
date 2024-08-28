import React, { useMemo, useState } from 'react';
import MainLayout from '../../../Layouts/MainLayout';
import Create from './Create';
import Update from './Update';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { rupiah } from '../../../utils';
import Card from '../../../Components/Card';

const Index = ({ productPackages, units }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, productPackage: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);

    const handleEditButton = (productPackage) => {
        setShowUpdateModal({ modal: true, productPackage });
    };

    const handleDeleteButton = (id) => {
        router.delete(`/products/package/${id}`, {
            preserveScroll: true,
            onStart: () => setLoadingButton(id),
            onFinish: () => setLoadingButton(null)
        });
    };

    const handleProductButton = () => {
        router.get('/products');
    };

    const handleLihatButton = (id) => {
        router.get(`/products/package/${id}`);
    };

    const filteredProductsPackage = productPackages.data.filter(
        (productPackage) =>
            productPackage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productPackage.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productPackage.purchase_price.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Nama Paket',
                name: 'name'
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: (row) => rupiah(row.total_purchase_price)
            },
            {
                label: 'Harga Jual',
                name: 'price',
                renderCell: (row) => rupiah(row.price)
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
                        <BadgeButton
                            onClick={() => handleLihatButton(row.id)}
                            text="lihat"
                            color="info"
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
            <Card.CardHeader
                titleText="Table Produk Paket"
                rightComponent={
                    <SplitButton color="danger" text="Produk" icon={<FaArrowLeft />} onClick={() => handleProductButton(true)} />
                }
            />
            <Card.CardBody>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton color="primary" text="Baru" icon={<FaPlus />} onClick={() => setShowCreateModal(true)} />
                    </div>
                </div>
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table columns={columns} rows={filteredProductsPackage.slice(0, entriesPerPage)} />
                <Pagination links={productPackages.links} />
            </Card.CardBody>

            {showCreateModal && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} units={units} />}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={setShowUpdateModal}
                    units={units}
                    productPackage={showUpdateModal.productPackage}
                />
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Product Package Page" />;

export default Index;

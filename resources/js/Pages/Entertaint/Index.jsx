import MainLayout from '../../Layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import BadgeButton from '../../Components/Button/BadgeButton';
import Card from '../../Components/Card';
import { FaPlus } from 'react-icons/fa';
import { formatDate, rupiah } from '../../utils';
import { router } from '@inertiajs/react';
import Confirm from '../../Components/Confirm/Confirm';

const Index = ({ entertaint }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, entertaint: null });
    const [loadingButton, setLoadingButton] = useState(null);
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
            router.delete(`/entertaint/${itemToDelete}`, {
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

    const handleEditButton = (entertaint) => {
        setShowModalUpdate({ modal: true, entertaint: entertaint });
    };

    const filteredEntertaint = entertaint.data.filter(
        (entertaint) =>
            entertaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entertaint.amount.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal',
                name: 'date',
                rowSpan: 2,
                renderCell: (row) => formatDate(row.date)
            },
            {
                label: 'Detail',
                name: 'description',
                rowSpan: 2
            },
            {
                label: 'Nilai',
                name: 'amount',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.amount)
            },
            {
                label: 'Pajak',
                colSpan: 2,
                groupColumn: [
                    {
                        label: 'Nilai',
                        name: 'tax_value',
                        renderCell: (row) => (row.tax ? rupiah(row.amount / row.tax.tax_value) : '-')
                    },
                    {
                        label: 'Persen',
                        name: 'tax',
                        renderCell: (row) => (row.tax ? row.tax.tax + '%' : '-')
                    }
                ]
            },
            {
                label: 'Dana',
                name: 'funding',
                rowSpan: 2
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
                        {row.proof && (
                            <BadgeButton
                                onClick={() => console.log('lihat bukti')}
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

    const totals = useMemo(() => {
        const totalNilai = entertaint.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalPajakMasukan = entertaint.data.reduce((total, row) => {
            if (row.tax && row.tax.tax_value) {
                const taxValue = Number(row.amount) / Number(row.tax.tax_value);
                return total + taxValue;
            }
            return total;
        }, 0);

        return {
            totalNilai: rupiah(totalNilai),
            totalPajakMasukan: rupiah(totalPajakMasukan)

        };
    }, [entertaint]);

    const footerColumns = [
        { key: 'totalNilai', label: 'Total Nilai' },
        { key: 'totalPajakMasukan', label: 'Total Pajak Masukan' }

    ];

    return (
        <Card>
            <Card.CardHeader titleText="Table Entertaint Cost" />
            <Card.CardBody>
                <SplitButton
                    color="success"
                    text="New Entertaint Cost"
                    icon={<FaPlus />}
                    onClick={() => setShowModalCreate(true)}
                    style={{
                        position: isSticky ? 'fixed' : 'relative',
                        top: isSticky ? '10px' : '0px',
                        right: '0px',
                        zIndex: 1000,
                        transition: 'position 0.3s ease, top 0.3s ease'
                    }}
                />
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table
                    columns={columns}
                    rows={filteredEntertaint.slice(0, entriesPerPage)}
                    footer={totals}
                    footerColumns={footerColumns}
                />
                <Pagination
                    links={entertaint.links}
                    currentPage={entertaint.current_page}
                    totalEntries={entertaint.total}
                    perPage={entertaint.per_page}
                />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} />}
            {showModalUpdate.modal && (
                <Update
                    showModal={showModalUpdate.modal}
                    setShowModal={setShowModalUpdate}
                    entertaint={showModalUpdate.entertaint}
                />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="entertaint"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Entertaint Page" />;

export default Index;

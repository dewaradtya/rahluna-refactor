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

const Index = ({ oprasionals }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, oprasional: null });
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
            router.delete(`/oprasional/${itemToDelete}`, {
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

    const handleEditButton = (oprasional) => {
        setShowModalUpdate({ modal: true, oprasional: oprasional });
    };

    const filteredOperasional = oprasionals.data.filter(
        (operasional) =>
            operasional.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            operasional.funding.toLowerCase().includes(searchTerm.toLowerCase()) ||
            operasional.amount.toLowerCase().includes(searchTerm.toLowerCase())
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
        const totalNilai = oprasionals.data.reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalGaji = oprasionals.data
            .filter((row) => row.funding === 'Gaji')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalFee = oprasionals.data
            .filter((row) => row.funding === 'Fee')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalBayarPajak = oprasionals.data
            .filter((row) => row.funding === 'Bayar Pajak')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalPajakMasukan = oprasionals.data.reduce((total, row) => {
            if (row.tax && row.tax.tax_value) {
                const taxValue = Number(row.amount) / Number(row.tax.tax_value);
                return total + taxValue;
            }
            return total;
        }, 0);

        return {
            totalNilai: rupiah(totalNilai),
            totalGaji: rupiah(totalGaji),
            totalFee: rupiah(totalFee),
            totalBayarPajak: rupiah(totalBayarPajak),
            totalPajakMasukan: rupiah(totalPajakMasukan)
        };
    }, [oprasionals]);

    const footerColumns = [
        { key: 'totalNilai', label: 'Total Nilai' },
        { key: 'totalGaji', label: 'Total Gaji' },
        { key: 'totalFee', label: 'Total Fee' },
        { key: 'totalBayarPajak', label: 'Total Bayar Pajak' },
        { key: 'totalPajakMasukan', label: 'Total Pajak Masukan' }
    ];

    return (
        <Card>
            <Card.CardHeader titleText="Table Operasional" />
            <Card.CardBody>
                <SplitButton
                    color="success"
                    text="New Operasional"
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
                    rows={filteredOperasional.slice(0, entriesPerPage)}
                    footer={totals}
                    footerColumns={footerColumns}
                />
                <Pagination
                    links={oprasionals.links}
                    currentPage={oprasionals.current_page}
                    totalEntries={oprasionals.total}
                    perPage={oprasionals.per_page}
                />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} />}
            {showModalUpdate.modal && (
                <Update
                    showModal={showModalUpdate.modal}
                    setShowModal={setShowModalUpdate}
                    oprasional={showModalUpdate.oprasional}
                />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="oprasional"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Oprasional Page" />;

export default Index;

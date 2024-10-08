import MainLayout from '../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Create from './Create';
import Update from './Update';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import SplitButton from '../../Components/Button/SplitButton';
import Card from '../../Components/Card';
import { FaFile, FaPlus } from 'react-icons/fa';
import { formatDate, rupiah } from '../../utils';
import { router } from '@inertiajs/react';
import Confirm from '../../Components/Confirm/Confirm';
import { PiExportDuotone } from 'react-icons/pi';
import { MdAttachMoney } from 'react-icons/md';
import BadgeButton from '../../Components/Button/BadgeButton';
import Menu from './Menu';
import UangMasuk from './UangMasuk';
import UangKeluar from './UangKeluar';
import MaterialStok from './MaterialStok';
import ImportPurchase from './ImportPurchase';

const Index = ({ projects, customers, product }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalMenu, setShowModalMenu] = useState(false);
    const [showUangMasukModal, setShowUangMasukModal] = useState(false);
    const [showUangKeluarModal, setShowUangKeluarModal] = useState(false);
    const [showMaterialStokModal, setShowMaterialStokModal] = useState(false);
    const [showImportPurchaseModal, setShowImportPurchaseModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState({ modal: false, project: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleDeleteButton = (id) => {
        console.log('Delete button clicked for ID:', id);
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/project/${itemToDelete}`, {
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

    const handleEditButton = (project) => {
        setShowModalUpdate({ modal: true, project: project });
    };

    const filteredProject = projects.data.filter(
        (project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.customers?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'User',
                name: 'user',
                rowSpan: 2,
                renderCell: (row) => {
                    return row.customer?.name || 'N/A';
                }
            },
            {
                label: 'Nama Project',
                name: 'name',
                rowSpan: 2,
                renderCell: (row) => (
                    <p
                        className="text-danger"
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setSelectedProject(row);
                            setShowModalMenu(true);
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        {row.name}
                    </p>
                )
            },
            {
                label: 'Nilai P.O',
                name: 'nilai_penawaran',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.nilai_penawaran)
            },
            {
                label: 'Material Pajak',
                name: 'material_pajak',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_material || 0)
            },
            {
                label: 'Material Non-Pajak',
                name: 'material_non_pajak',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_material || 0)
            },
            {
                label: 'Material Invoice',
                name: 'material_inv',
                rowSpan: 2
            },
            {
                label: 'Pekerja',
                name: 'pekerja',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_pekerja || 0)
            },
            {
                label: 'Oprasional',
                name: 'oprasional',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_oprasional || 0)
            },
            {
                label: 'Sewa Alat',
                name: 'sewa_alat',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_sewa_alat || 0)
            },
            {
                label: 'Konsumsi',
                name: 'konsumsi',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_konsumsi || 0)
            },
            {
                label: 'Transport',
                name: 'transport',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_transport || 0)
            },
            {
                label: 'Aset',
                name: 'aset',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.total_aset || 0)
            },
            {
                label: 'Potensi Profit',
                colSpan: 2,
                groupColumn: [
                    {
                        label: 'Nilai',
                        name: 'profit_value',
                        renderCell: (row) => {
                            const totalRequirements =
                                (row.total_oprasional || 0) +
                                (row.total_sewa_alat || 0) +
                                (row.total_konsumsi || 0) +
                                (row.total_transport || 0) +
                                (row.total_aset || 0) +
                                (row.total_material || 0) +
                                (row.total_pekerja || 0);

                            const profit = row.nilai_penawaran - totalRequirements;
                            return rupiah(profit || 0);
                        }
                    },
                    {
                        label: 'Persen',
                        name: 'profit_percentage',
                        renderCell: (row) => {
                            const totalRequirements =
                                (row.total_oprasional || 0) +
                                (row.total_sewa_alat || 0) +
                                (row.total_konsumsi || 0) +
                                (row.total_transport || 0) +
                                (row.total_aset || 0) +
                                (row.total_material || 0) +
                                (row.total_pekerja || 0);

                            const profit = row.nilai_penawaran - totalRequirements;

                            const percentage = row.nilai_penawaran ? (profit / row.nilai_penawaran) * 100 : 0;
                            return `${percentage.toFixed(2)}%`;
                        }
                    }
                ]
            },
            {
                label: 'Hutang',
                name: 'hutang',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.nilai_penawaran - row.total_uang_masuk || 0)
            },
            {
                label: 'Pajak',
                name: 'pajak',
                rowSpan: 2
            },
            {
                label: 'Deadline',
                name: 'deadline',
                rowSpan: 2,
                renderCell: (row) => formatDate(row.deadline)
            },
            {
                label: 'Status',
                name: 'status',
                rowSpan: 2,
                renderCell: (row) => {
                    const status = row.status;
                    let color;
                    let keadaan;

                    if (status === 'selesai') {
                        color = 'success';
                        keadaan = 'Selesai';
                    } else if (new Date() > new Date(row.deadline)) {
                        color = 'danger';
                        keadaan = 'Over Time';
                    } else if (status === 'berlangsung') {
                        color = 'warning';
                        keadaan = 'Process';
                    } else {
                        color = 'secondary';
                        keadaan = 'Unknown';
                    }

                    return <BadgeButton text={keadaan} color={color} />;
                }
            }
        ],
        [loadingButton]
    );

    const totals = useMemo(() => {
        // Calculate totals based on projects data
        const totalNilai = projects.data.reduce((total, row) => total + (Number(row.nilai_penawaran) || 0), 0);
        const totalPajak = projects.data.reduce((total, row) => {
            const taxValue = row.tax && row.tax.tax_value ? Number(row.tax.tax_value) : 0;
            return total + taxValue;
        }, 0);
        const totalPotensiProfit = projects.data.reduce((total, row) => {
            const totalRequirements =
                (row.total_oprasional || 0) +
                (row.total_sewa_alat || 0) +
                (row.total_konsumsi || 0) +
                (row.total_transport || 0) +
                (row.total_aset || 0) +
                (row.total_material || 0) +
                (row.total_pekerja || 0);

            const profit = row.nilai_penawaran - totalRequirements;
            return total + profit;
        }, 0);
        const kurangBayar = projects.data.reduce((total, row) => {
            return total + (row.nilai_penawaran - (row.total_uang_masuk || 0));
        }, 0);

        return {
            totalNilai: rupiah(totalNilai),
            totalPajak: rupiah(totalPajak),
            totalPotensiProfit: rupiah(totalPotensiProfit),
            kurangBayar: rupiah(kurangBayar)
        };
    }, [projects.data]);

    const footerColumns = [
        { key: 'totalNilai', label: 'Total Nilai' },
        { key: 'totalPajak', label: 'Total Pajak' },
        { key: 'totalPotensiProfit', label: 'Total Potensi Profit' },
        { key: 'kurangBayar', label: 'Kurang Bayar' }
    ];

    return (
        <Card>
            <Card.CardHeader titleText="Table Project" />
            <Card.CardBody>
                <div className="d-sm-flex align-items-center justify-start mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="primary"
                            text="Projek Baru"
                            icon={<FaPlus />}
                            onClick={() => setShowModalCreate(true)}
                        />
                        <SplitButton
                            color="dark"
                            text="Export Excel"
                            icon={<PiExportDuotone />}
                            onClick={() => (window.location.href = '/projects/export')}
                        />
                    </div>
                </div>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="success"
                            text="Masuk"
                            icon={<MdAttachMoney />}
                            onClick={() => setShowUangMasukModal(true)}
                        />
                        <SplitButton
                            color="danger"
                            text="Keluar"
                            icon={<MdAttachMoney />}
                            onClick={() => setShowUangKeluarModal(true)}
                        />
                        <SplitButton
                            color="secondary"
                            text="Material Stok"
                            icon={<FaPlus />}
                            onClick={() => setShowMaterialStokModal(true)}
                        />
                        <SplitButton
                            color="warning"
                            text="Import Purchase"
                            icon={<FaFile />}
                            onClick={() => setShowImportPurchaseModal(true)}
                        ></SplitButton>
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
                    rows={filteredProject.slice(0, entriesPerPage)}
                    footer={totals}
                    footerColumns={footerColumns}
                />
                <Pagination
                    links={projects.links}
                    currentPage={projects.current_page}
                    totalEntries={projects.total}
                    perPage={projects.per_page}
                />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} customers={customers} />}
            {showModalMenu && (
                <Menu
                    showModal={showModalMenu}
                    setShowModal={setShowModalMenu}
                    project={selectedProject}
                    onEdit={handleEditButton}
                />
            )}
            {showModalUpdate.modal && (
                <Update
                    showModal={showModalUpdate.modal}
                    setShowModal={setShowModalUpdate}
                    project={showModalUpdate.project}
                    customers={customers}
                />
            )}
            {showDeleteModal && (
                <Confirm
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                    onDelete={handleConfirmDelete}
                    dataType="project"
                />
            )}
            {showUangMasukModal && (
                <UangMasuk showModal={showUangMasukModal} setShowModal={setShowUangMasukModal} projects={projects.data} />
            )}
            {showUangKeluarModal && (
                <UangKeluar showModal={showUangKeluarModal} setShowModal={setShowUangKeluarModal} projects={projects.data} />
            )}
            {showMaterialStokModal && (
                <MaterialStok
                    showModal={showMaterialStokModal}
                    setShowModal={setShowMaterialStokModal}
                    product={product}
                    projects={projects.data}
                />
            )}
            {showImportPurchaseModal && (
                <ImportPurchase
                    showModal={showImportPurchaseModal}
                    setShowModal={setShowImportPurchaseModal}
                    product={product}
                    projects={projects.data}
                />
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Project Page" />;

export default Index;

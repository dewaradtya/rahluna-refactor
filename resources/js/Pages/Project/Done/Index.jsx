import MainLayout from '../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
// import Create from './Create';
// import Update from './Update';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import Card from '../../../Components/Card';
import { formatDate, rupiah } from '../../../utils';
import { router } from '@inertiajs/react';
import Confirm from '../../../Components/Confirm/Confirm';
import { PiExportDuotone } from 'react-icons/pi';
import BadgeButton from '../../../Components/Button/BadgeButton';
import Menu from './Menu';

const Index = ({ projects, customers, product }) => {
    const [showModalMenu, setShowModalMenu] = useState(false);
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
                rowSpan: 2
            },
            {
                label: 'Material Non-Pajak',
                name: 'material_non_pajak',
                rowSpan: 2
            },
            {
                label: 'Material Invoice',
                name: 'material_inv',
                rowSpan: 2
            },
            {
                label: 'Pekerja',
                name: 'pekerja',
                rowSpan: 2
            },
            {
                label: 'Oprasional',
                name: 'oprasional',
                rowSpan: 2
            },
            {
                label: 'Sewa Alat',
                name: 'sewa_alat',
                rowSpan: 2
            },
            {
                label: 'Konsumsi',
                name: 'konsumsi',
                rowSpan: 2
            },
            {
                label: 'Transport',
                name: 'transport',
                rowSpan: 2
            },
            {
                label: 'Aset',
                name: 'aset',
                rowSpan: 2
            },
            {
                label: 'Potensi Profit',
                colSpan: 2,
                groupColumn: [
                    {
                        label: 'Nilai',
                        name: 'profit_value',
                        renderCell: (row) => rupiah(row.nilai_penawaran)
                    },
                    {
                        label: 'Persen',
                        name: 'profit',
                        renderCell: (row) => {
                            const persen = row.nilai_penawaran ? (row.nilai_penawaran / row.nilai_penawaran) * 100 + '%' : '-';
                            return persen;
                        }
                    }
                ]
            },
            {
                label: 'Hutang',
                name: 'hutang',
                rowSpan: 2
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

                    if (new Date() > new Date(row.deadline)) {
                        color = 'danger';
                        keadaan = 'Over Time';
                    } else if (status === 'selesai') {
                        color = 'success';
                        keadaan = 'Selesai';
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
        const totalNilai = projects.data.reduce((total, row) => total + (Number(row.nilai_penawaran) || 0), 0);
        const totalGaji = projects.data
            .filter((row) => row.funding === 'Gaji')
            .reduce((total, row) => total + (Number(row.total_payment) || 0), 0);
        const totalFee = projects.data
            .filter((row) => row.funding === 'Fee')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalEntertaintCost = projects.data
            .filter((row) => row.funding === 'Entertaint Cost')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);
        const totalPajakMasukan = projects.data.reduce((total, row) => {
            const taxValue = row.tax && row.tax.tax_value ? Number(row.tax.tax_value) : 0;
            return total + taxValue;
        }, 0);

        return {
            totalNilai: rupiah(totalNilai),
            totalGaji: rupiah(totalGaji),
            totalFee: rupiah(totalFee),
            totalEntertaintCost: rupiah(totalEntertaintCost),
            totalPajakMasukan: rupiah(totalPajakMasukan)
        };
    }, [projects]);

    const footerColumns = [
        { key: 'totalNilai', label: 'Total Nilai' },
        { key: 'totalFee', label: 'Total Pajak' },
        { key: 'totalEntertaintCost', label: 'Total Potensi Profit' },
        { key: 'totalPajakMasukan', label: 'Kurang Bayar' }
    ];

    return (
        <Card>
            <Card.CardHeader titleText="Table Project Finished" />
            <Card.CardBody>
                <div className="d-sm-flex align-items-center justify-start mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap">
                        <SplitButton
                            color="dark"
                            text="Export Excel"
                            icon={<PiExportDuotone />}
                            onClick={() => setShowCreateModal(true)}
                        />
                    </div>
                </div>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex column-gap-1 align-items-start flex-wrap"></div>
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
                <Pagination links={projects.links} />
            </Card.CardBody>

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
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Project Page" />;

export default Index;

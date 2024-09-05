import MainLayout from '../../../Layouts/MainLayout';
import { useMemo, useState } from 'react';
import Table from '../../../Components/Table';
import Pagination from '../../../Components/Pagination';
import SplitButton from '../../../Components/Button/SplitButton';
import BadgeButton from '../../../Components/Button/BadgeButton';
import Card from '../../../Components/Card';
import { FaArrowLeft, FaFile, FaPlus } from 'react-icons/fa';
import { formatDate, rupiah } from '../../../utils';
import { router } from '@inertiajs/react';
import Confirm from '../../../Components/Confirm/Confirm';
import { MdAttachMoney } from 'react-icons/md';
import UangMasuk from './UangMasuk';
import UangKeluar from './UangKeluar';
import SplitButtonGroup from '../../../Components/Button/SplitButtonGroup';
import Update from './Update';
import ImportExcel from './ImportExcel';

const Index = ({ projectDetail, project, customer }) => {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showUangMasukModal, setShowUangMasukModal] = useState(false);
    const [showUangKeluarModal, setShowUangKeluarModal] = useState(false);
    const [showImportProductModal, setShowImportProductModal] = useState(false);
    const [showModalUpdateUangMasuk, setShowModalUpdateUangMasuk] = useState({ modal: false, projectDetail: null });
    const [loadingButton, setLoadingButton] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteButton = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            router.delete(`/project/detail/${itemToDelete}`, {
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

    const handleEditButton = (projectDetail) => {
        setShowModalUpdateUangMasuk({ modal: true, projectDetail: projectDetail });
    };

    const handleBackButton = () => {
        router.get('/project');
    };

    const filteredProjectDetail =
        projectDetail?.data?.filter(
            (Detail) =>
                Detail.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Detail.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Detail.amount.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const columns = useMemo(
        () => [
            {
                label: 'Tanggal',
                name: 'date',
                rowSpan: 2,
                renderCell: (row) => formatDate(row.date)
            },
            {
                label: 'Kebutuhan',
                name: 'requirement',
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
                label: 'Nilai Sebelum Pajak',
                name: 'previous_tax_value',
                rowSpan: 2,
                renderCell: (row) => rupiah(row.tax ? row.amount - row.amount / row.tax.tax_value : row.amount)
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
        const NilaiPO = project?.nilai_penawaran ? Number(project.nilai_penawaran) : 0;

        const totalGaji = projectDetail.data
            .filter((row) => row.requirement === 'Gaji')
            .reduce((total, row) => total + (Number(row.total_payment) || 0), 0);

        const totalFee = projectDetail.data
            .filter((row) => row.requirement === 'Fee')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);

        const totalBayarPajak = projectDetail.data
            .filter((row) => row.requirement === 'Bayar Pajak')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);

        const pemasukan = projectDetail.data
            .filter((row) => row.requirement === 'Uang Masuk')
            .reduce((total, row) => total + (Number(row.amount) || 0), 0);

        const totalPajakMasukan = projectDetail.data.reduce((total, row) => {
            const taxValue = row.tax && row.tax.tax_value ? Number(row.amount / row.tax.tax_value) : 0;
            return total + taxValue;
        }, 0);

        return {
            NilaiPO: rupiah(NilaiPO),
            totalGaji: rupiah(totalGaji),
            totalFee: rupiah(totalFee),
            totalBayarPajak: rupiah(totalBayarPajak),
            pemasukan: rupiah(pemasukan),
            totalPajakMasukan: rupiah(totalPajakMasukan)
        };
    }, [project, projectDetail]);

    const footerColumns = [
        { key: 'NilaiPO', label: 'Nilai PO' },
        { key: 'totalGaji', label: 'Nilai Kurang Bayar' },
        { key: 'totalFee', label: 'Nilai Pajak Masukan' },
        { key: 'totalPajakMasukan', label: 'Nilai Pajak Keluaran' },
        { key: 'totalBayarPajak', label: 'Nilai Total Pengeluaran' },
        { key: 'pemasukan', label: 'Nilai Total Pemasukan' }
    ];

    return (
        <Card>
            <Card.CardHeader
                titleText="Detail Project"
                rightComponent={
                    <SplitButton color="danger" text="Kembali" icon={<FaArrowLeft />} onClick={() => handleBackButton(true)} />
                }
            />
            <Card.CardBody>
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
                            onClick={() => setShowCreateModal(true)}
                        />
                        <SplitButton
                            color="warning"
                            text="Import Purchase"
                            icon={<FaFile />}
                            onClick={() => setShowCreateModal(true)}
                        ></SplitButton>
                        <SplitButtonGroup
                            color="info"
                            text="Import Excel"
                            icon={<FaFile />}
                            dropdownOpen={dropdownOpen}
                            setDropdownOpen={setDropdownOpen}
                            onClick={() => setShowImportProductModal(true)}
                        >
                            <SplitButtonGroup.Link
                                href={`/project/detail/${project.id}/download-format`}
                                dropdownOpen={dropdownOpen}
                                setDropdownOpen={setDropdownOpen}
                            >
                                Download Format
                            </SplitButtonGroup.Link>
                        </SplitButtonGroup>
                    </div>
                </div>
                <p className="fw-bold">
                    Project: <span className="fw-normal">{project ? `${project.name}` : 'No Project Selected'}</span>
                </p>
                <p className="fw-bold">
                    User: <span className="fw-normal">{project?.customer ? project.customer.name : 'No customer Selected'}</span>
                </p>
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />
                <Table
                    columns={columns}
                    rows={filteredProjectDetail.slice(0, entriesPerPage)}
                    footer={totals}
                    footerColumns={footerColumns}
                />
                <Pagination links={projectDetail.links} />
            </Card.CardBody>

            {showModalCreate && <Create showModal={showModalCreate} setShowModal={setShowModalCreate} />}
            {showModalUpdateUangMasuk.modal && (
                <Update
                    showModal={showModalUpdateUangMasuk.modal}
                    setShowModal={setShowModalUpdateUangMasuk}
                    projectDetail={showModalUpdateUangMasuk.projectDetail}
                />
            )}
            {showUangMasukModal && (
                <UangMasuk showModal={showUangMasukModal} setShowModal={setShowUangMasukModal} projectId={project.id} />
            )}
            {showUangKeluarModal && (
                <UangKeluar showModal={showUangKeluarModal} setShowModal={setShowUangKeluarModal} projectId={project.id} />
            )}
            {showImportProductModal && (
                <ImportExcel showModal={showImportProductModal} setShowModal={setShowImportProductModal} projectId={project.id} />
            )}
            <Confirm
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                onDelete={handleConfirmDelete}
                dataType="project detail"
            />
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Project Detail Page" />;

export default Index;

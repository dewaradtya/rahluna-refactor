import React, { useMemo, useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import Table from '../../Components/Table';
import Pagination from '../../Components/Pagination';
import Card from '../../Components/Card';
import { rupiah } from '../../utils';
import Modal from '../../Components/Modal';

const Index = ({ project }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [loadingButton, setLoadingButton] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState({ modal: false, project: null });
    const [imageModal, setImageModal] = useState({ visible: false, src: '' });

    const handleEditButton = (project) => {
        setShowUpdateModal({ modal: true, project: project });
    };

    const handleImageModalOpen = (imageSrc) => {
        setImageModal({ visible: true, src: imageSrc });
    };

    const handleImageModalClose = () => {
        setImageModal({ visible: false, src: '' });
    };

    const filteredProject = project.data.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = useMemo(
        () => [
            {
                label: 'Project',
                name: 'name',
                renderCell: (row) => row.name
            },
            {
                label: 'Pajak Masuk',
                name: 'nilai_pajakMt',
                renderCell: (row) => row.nilai_pajakM
            },
            {
                label: 'Pajak Keluar',
                name: 'nilai_pajakK',
                renderCell: (row) => rupiah(row.nilai_pajakK)
            },
            {
                label: 'Pajak Dibayar',
                name: 'pajak',
                renderCell: (row) => rupiah(row.pajak)
            },
            {
                label: 'Tanggal Selesai',
                name: 'deadline',
                renderCell: (row) => rupiah(row.deadline)
            },
            {
                label: 'Proggres',
                name: 'status',
                renderCell: (row) => rupiah(row.status)
            }
        ],
        [loadingButton]
    );

    return (
        <Card>
            <Card.CardHeader titleText="Table Pajak" />
            <Card.CardBody>
                {/* Input pencarian dan dropdown entri per halaman */}
                <Card.CardFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                />

                <Table columns={columns} rows={filteredProject.slice(0, entriesPerPage)} />
                <Pagination
                    links={project.links}
                    currentPage={project.current_page}
                    totalEntries={project.total}
                    perPage={project.per_page}
                />
            </Card.CardBody>

            {/* Modal untuk Update project */}
            {showUpdateModal.modal && (
                <Update
                    showModal={showUpdateModal.modal}
                    setShowModal={() => setShowUpdateModal({ modal: false, project: null })}
                    project={showUpdateModal.project}
                />
            )}
            {imageModal.visible && (
                <Modal title="Bukti" showModal={imageModal.visible} setShowModal={handleImageModalClose}>
                    <Modal.Body>
                        <img src={imageModal.src} alt="Bukti" className="w-full" />
                    </Modal.Body>
                </Modal>
            )}
        </Card>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Potongan PPN dan PPH Page" />;

export default Index;

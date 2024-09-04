import { router } from '@inertiajs/react';
import Modal from '../../Components/Modal';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdDone, MdEdit } from 'react-icons/md';

const Menu = ({ showModal, setShowModal, project, onEdit }) => {
    const handleDelete = () => {
        if (project && project.id) {
            router.delete(`/project/${project.id}`, {
                preserveScroll: true,
                onStart: () => {
                    // You can set loading state here if needed
                },
                onFinish: () => {
                    setShowModal(false);
                    // Optionally handle cleanup after deletion
                },
                onError: () => {
                    // Handle error if the deletion fails
                },
            });
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(project);
        }
        setShowModal(false);
    };

    const handleView = () => {
        console.log('Lihat');
    };

    const handleComplete = () => {
        console.log('Selesai');
    };

    return (
        <Modal title="Aksi" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <div className="d-flex justify-content-around">
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <RiDeleteBin6Fill size={24} />
                        <span className="mt-2 small">Hapus</span>
                    </button>

                    <button
                        onClick={handleView}
                        className="btn btn-primary d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <FaMagnifyingGlass size={24} />
                        <span className="mt-2 small">Lihat</span>
                    </button>

                    <button
                        onClick={handleEdit}
                        className="btn btn-warning d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <MdEdit size={24} />
                        <span>Edit</span>
                    </button>

                    <button
                        onClick={handleComplete}
                        className="btn btn-success d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                    >
                        <MdDone size={24} />
                        <span>Selesai</span>
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Menu;

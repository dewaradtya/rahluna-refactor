import React from 'react';
import Modal from './ConfirmModal';
import Button from '../Button/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const Confirm = ({ showModal, setShowModal, onDelete, dataType }) => {
    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <FaExclamationTriangle size={80} className="text-warning mb-3" />
                <h2 className="text-dark">Are you sure?</h2>
                <p className="text-muted">
                    This action will permanently delete the <b>{dataType}</b>. It cannot be undone.
                </p>
                <div className="d-flex justify-content-center mt-4">
                    <Button bgcolor="#6c757d" color="white" text="Cancel" onClick={() => setShowModal(false)} />
                    <Button bgcolor="#d9534f" color="white" text={`Delete ${dataType}`} onClick={onDelete} />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Confirm;

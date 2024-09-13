import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const LogoutConfirm = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div
            className="modal show fade"
            style={{
                display: 'block',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div
                    className="modal-content border-0 shadow"
                    style={{ transform: 'scale(1)', transition: 'transform 0.3s ease-in-out' }}
                >
                    <div className="modal-header bg-light text-dark">
                        <h5 className="modal-title">
                            <FaExclamationTriangle className="mr-2 text-danger" /> Logout Confirmation
                        </h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <p className="mb-4">Are you sure you want to log out?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button
                            type="button"
                            className="btn btn-light px-4 py-2"
                            onClick={onClose}
                            style={{
                                borderRadius: '30px',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger px-4 py-2 ml-3"
                            onClick={onConfirm}
                            style={{
                                borderRadius: '30px',
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                transition: 'background-color 0.2s ease',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirm;

import { router } from '@inertiajs/react';
import React from 'react';

const Card = ({ children }) => {
    return <div className="card shadow mb-4">{children}</div>;
};

const CardHeader = ({ className = '', titleText, additionalInfo, children, rightComponent }) => {
    return (
        <div className={`card-header py-3 d-flex justify-content-between align-items-center ${className}`}>
            <div>
                <h6 className="m-0 font-weight-bold text-primary">{titleText}</h6>
                {additionalInfo && (
                    <p className="m-0 text-sm text-secondary" style={{ fontSize: '0.85rem' }}>
                        {additionalInfo}
                    </p>
                )}
            </div>
            {rightComponent}
            {children}
        </div>
    );
};

const CardBody = ({ children }) => {
    return <div className="card-body">{children}</div>;
};

const CardFilter = ({ searchTerm, setSearchTerm, entriesPerPage, setEntriesPerPage }) => {
    const handleEntriesChange = (e) => {
        const newEntriesPerPage = Number(e.target.value);
        setEntriesPerPage(newEntriesPerPage);

        // Kirim request ke server dengan perPage yang baru
        router.visit(window.location.pathname, {
            method: 'get',
            data: { perPage: newEntriesPerPage },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="my-2 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <select
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                    className="p-2 border rounded me-2"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
                <p className="mb-0 text-muted">Entries per page</p>
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
            />
        </div>
    );
};

Card.CardHeader = CardHeader;
Card.CardBody = CardBody;
Card.CardFilter = CardFilter;

export default Card;

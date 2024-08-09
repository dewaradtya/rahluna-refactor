import React from 'react';

const Card = ({ children }) => {
    return <div className="card shadow mb-4">{children}</div>;
};

const CardHeader = ({ className = '', titleText, additionalInfo, children, rightComponent }) => {
    return (
        <div className={`card-header py-3 d-flex justify-content-between align-items-center ${className}`}>
            <div>
                <h6 className="m-0 font-weight-bold text-primary">{titleText}</h6>
                {additionalInfo && <p className="m-0 text-secondary">{additionalInfo}</p>}
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
    return (
        <div className="my-2 flex items-center space-x-4">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
            />
            <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="p-2 border rounded"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
            </select>
        </div>
    );
};

Card.CardHeader = CardHeader;
Card.CardBody = CardBody;
Card.CardFilter = CardFilter;

export default Card;

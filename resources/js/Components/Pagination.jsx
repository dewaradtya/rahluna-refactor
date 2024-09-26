import { router } from '@inertiajs/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ links = [], currentPage, totalEntries, perPage }) {
    if (!links.length || links.length < 2) return null;

    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalEntries);

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="entries-info text-muted">
                Showing {start} to {end} of {totalEntries} entries
            </div>

            <nav>
                <ul className="pagination mb-0">
                    {links.map((link, index) => {
                        return link?.url === null ? (
                            <PageInactive key={index} label={link.label} />
                        ) : (
                            <PaginationItem key={index} {...link} />
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

function PaginationItem({ active, label, url }) {
    const handleClick = (e) => {
        e.preventDefault();
        router.visit(url, {
            method: 'get',
            data: { perPage: new URL(url).searchParams.get('perPage') },
            preserveScroll: true,
            preserveState: true
        });
    };

    return (
        <li className={`page-item ${active ? 'active' : ''}`}>
            <a href={url} className="page-link layered-shadow" onClick={handleClick}>
                {label.includes('Previous') ? (
                    <FaChevronLeft />
                ) : label.includes('Next') ? (
                    <FaChevronRight />
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: label }}></span>
                )}
            </a>
        </li>
    );
}

function PageInactive({ label }) {
    return (
        <li className="page-item disabled">
            <span className="page-link">
                {label.includes('Previous') ? (
                    <FaChevronLeft />
                ) : label.includes('Next') ? (
                    <FaChevronRight />
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: label }}></span>
                )}
            </span>
        </li>
    );
}

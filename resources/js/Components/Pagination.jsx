import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (links.length === 3) return null;

    return (
        <nav>
            <ul className="pagination mt-3">
                {links?.map((link, index) => {
                    return link?.url === null ? (
                        <PageInactive key={index} label={link.label} />
                    ) : (
                        <PaginationItem key={index} {...link} />
                    );
                })}
            </ul>
        </nav>
    );
}

function PaginationItem({ active, label, url }) {
    return (
        <li>
            <Link className={`page-link layered-shadow ${active ? 'active' : ''}`} href={url}>
                <span dangerouslySetInnerHTML={{ __html: label }}></span>
            </Link>
        </li>
    );
}

function PageInactive({ label }) {
    return (
        <li className="page-link">
            <span dangerouslySetInnerHTML={{ __html: label }}></span>
        </li>
    );
}

import { Link } from '@inertiajs/react';

const BadgeLink = ({ text, href, color, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }
    return (
        <Link href={href} className={`badge badge-${color} border-0 mr-1`} {...linkProps}>
            {text}
        </Link>
    );
};

export default BadgeLink;

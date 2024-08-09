import { Link } from '@inertiajs/react';

const Navlink = ({ children, id, onclick, type = 'link', ...props }) => {
    const linkProps = {
        id,
        ...props
    };

    if (onclick) {
        linkProps.onClick = onclick;
    }

    return type === 'button' ? <button {...linkProps}>{children}</button> : <Link {...linkProps}>{children}</Link>;
};

export default Navlink;

import { Link, useForm, usePage } from '@inertiajs/react';
import { useContext, useState } from 'react';
import {
    FaBalanceScale,
    FaBoxes,
    FaBriefcase,
    FaCog,
    FaExchangeAlt,
    FaHardHat,
    FaHome,
    FaShoppingCart,
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';
import { SidebarToggle } from '../../context/SidebarToggleContext';
import { ImCross } from 'react-icons/im';

const Sidebar = () => {
    const {
        additional: { sidebar }
    } = usePage().props;

    const { sidebarToggled, setSidebarToggled } = useContext(SidebarToggle);
    const [collapsedItems, setCollapsedItems] = useState({});

    const handleCollapseClick = (item) => {
        setCollapsedItems((prevState) => ({
            ...prevState,
            [item]: !prevState[item]
        }));
    };

    return (
        <ul
            className={`navbar-nav bg-gradient-dark sidebar sidebar-dark accordion ${sidebarToggled ? 'toggled' : ''}`}
            id="accordionSidebar"
        >
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div className="sidebar-brand-icon mx-3">
                    <img src="/img/logo-f.png" alt="Brand Icon" style={{ width: '50px', height: '60px' }} />
                </div>
                <ImCross /> 
                <div className="sidebar-brand-text mx-3">
                    <img src="/img/apple-touch-icon.png" alt="Brand Icon" style={{ width: '70px', height: '70px' }} />
                </div>
            </Link>

            <div className="sidebar-heading">Admin</div>
            <hr className="sidebar-divider my-0" />
            {sidebar.Admin && (
                <SidebarLink rows={sidebar.Admin} collapsedItems={collapsedItems} handleCollapseClick={handleCollapseClick} />
            )}

            <div className="sidebar-heading">Sales</div>
            <hr className="sidebar-divider my-0" />
            {sidebar.Sales && (
                <SidebarLink rows={sidebar.Sales} collapsedItems={collapsedItems} handleCollapseClick={handleCollapseClick} />
            )}

            <div className="sidebar-heading">General</div>
            <hr className="sidebar-divider my-0" />
            {sidebar.General && (
                <SidebarLink rows={sidebar.General} collapsedItems={collapsedItems} handleCollapseClick={handleCollapseClick} />
            )}

            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline ">
                <button
                    className="rounded-circle border-0 position-relative"
                    id="sidebarToggle"
                    onClick={() => setSidebarToggled(!sidebarToggled)}
                ></button>
            </div>
        </ul>
    );
};

const SidebarLink = ({ rows, collapsedItems, handleCollapseClick }) => {
    const { post } = useForm();
    const iconMapping = {
        'fa fa-home': <FaHome size={16} />,
        'fa fa-users': <FaUser size={16} />,
        'fa fa-hard-hat': <FaHardHat size={16} />,
        'fa fa-briefcase': <FaBriefcase size={16} />,
        'fa fa-boxes': <FaBoxes size={16} />,
        'fa fa-shopping-cart': <FaShoppingCart size={16} />,
        'fa fa-exchange-alt': <FaExchangeAlt size={16} />,
        'fa fa-salance-scale': <FaBalanceScale size={16} />,
        'fa fa-cog': <FaCog size={16} />,
        'fa fa-sign-out-alt': <FaSignOutAlt size={16} />
    };

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <>
            {rows.map((row, rowIndex) => (
                <li className="nav-item" key={rowIndex}>
                    {row.submenus?.length > 0 ? (
                        <>
                            <button
                                type="button"
                                className={`nav-link ${collapsedItems[rowIndex] ? '' : 'collapsed'}`}
                                data-toggle="collapse"
                                aria-expanded={collapsedItems[rowIndex] ? 'true' : 'false'}
                                aria-controls={`collapse${rowIndex}`}
                                onClick={() => handleCollapseClick(rowIndex)}
                            >
                                {iconMapping[row.icon]}
                                <span>{row.menu}</span>
                            </button>
                            <div
                                id={`collapse${rowIndex}`}
                                className={`collapse ${collapsedItems[rowIndex] ? 'show' : ''}`}
                                aria-labelledby="headingTwo"
                                data-parent="#accordionSidebar"
                            >
                                <div className="bg-white py-2 collapse-inner rounded">
                                    {row.submenus.map((submenu, submenuIndex) => (
                                        <Link className="collapse-item" href={submenu.url} key={submenuIndex}>
                                            {submenu.menu}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        row.url === '/logout' ? (
                            <a
                                className="nav-link"
                                href={row.url}
                                onClick={handleLogout}
                            >
                                {iconMapping[row.icon]}
                                <span>{row.menu}</span>
                            </a>
                        ) : (
                            <Link className="nav-link" href={row.url}>
                                {iconMapping[row.icon]}
                                <span>{row.menu}</span>
                            </Link>
                        )
                    )}
                </li>
            ))}
        </>
    );
};

export default Sidebar;

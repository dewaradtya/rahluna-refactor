import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useContext } from 'react';
import {
    FaBalanceScale,
    FaBoxes,
    FaBriefcase,
    FaCog,
    FaExchangeAlt,
    FaHardHat,
    FaHome,
    FaShoppingCart,
    FaUser,
    FaSignOutAlt
} from 'react-icons/fa';
import { SidebarToggle } from '../../context/SidebarToggleContext';
import LogoutConfirm from '../Confirm/LogoutConfirm';
import { ImCross } from 'react-icons/im';

const Sidebar = () => {
    const {
        additional: { sidebar }
    } = usePage().props;

    const { sidebarToggled, setSidebarToggled } = useContext(SidebarToggle);
    const [collapsedItems, setCollapsedItems] = useState({});
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };

    const handleCollapseClick = (item) => {
        setCollapsedItems((prevState) => ({
            ...prevState,
            [item]: !prevState[item]
        }));
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    useEffect(() => {
        setCollapsedItems({});
    }, [window.location.pathname]);

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

            {Object.entries(sidebar).map(([category, items]) => (
                <div key={category}>
                    <div className="sidebar-heading">{category}</div>
                    <hr className="sidebar-divider my-0" />
                    <SidebarLink rows={items} collapsedItems={collapsedItems} handleCollapseClick={handleCollapseClick} />
                </div>
            ))}

            <hr className="sidebar-divider my-0" />

            <li className="nav-item">
                <button className="nav-link" onClick={openLogoutModal}>
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                </button>
            </li>

            <div className="text-center d-none d-md-inline">
                <button
                    className="rounded-circle border-0 position-relative"
                    id="sidebarToggle"
                    onClick={() => setSidebarToggled(!sidebarToggled)}
                ></button>
            </div>

            <LogoutConfirm
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={() => {
                    closeLogoutModal();
                    handleLogout();
                }}
            />
        </ul>
    );
};

const SidebarLink = ({ rows, collapsedItems, handleCollapseClick }) => {
    const iconMapping = {
        'fa fa-home': <FaHome size={16} />,
        'fa fa-users': <FaUser size={16} />,
        'fa fa-hard-hat': <FaHardHat size={16} />,
        'fa fa-briefcase': <FaBriefcase size={16} />,
        'fa fa-boxes': <FaBoxes size={16} />,
        'fa fa-shopping-cart': <FaShoppingCart size={16} />,
        'fa fa-exchange-alt': <FaExchangeAlt size={16} />,
        'fa fa-salance-scale': <FaBalanceScale size={16} />,
        'fa fa-cog': <FaCog size={16} />
    };

    return (
        <>
            {rows.map((row, rowIndex) => (
                <li className="nav-item" key={rowIndex}>
                    {row.submenus?.length > 0 ? (
                        <>
                            <button
                                type="button"
                                className={`nav-link ${collapsedItems[row.menu] ? '' : 'collapsed'}`}
                                data-toggle="collapse"
                                aria-expanded={collapsedItems[row.menu] ? 'true' : 'false'}
                                aria-controls={`collapse${rowIndex}`}
                                onClick={() => handleCollapseClick(row.menu)}
                            >
                                {iconMapping[row.icon]}
                                <span>{row.menu}</span>
                            </button>
                            <div
                                id={`collapse${rowIndex}`}
                                className={`collapse ${collapsedItems[row.menu] ? 'show' : ''}`}
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
                        <Link className="nav-link" href={row.url}>
                            {iconMapping[row.icon]}
                            <span>{row.menu}</span>
                        </Link>
                    )}
                </li>
            ))}
        </>
    );
};

export default Sidebar;

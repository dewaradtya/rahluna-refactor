import { Link, usePage } from '@inertiajs/react';
import { useContext, useState } from 'react';
import { FaChartArea, FaCog, FaFolder, FaLaughWink, FaTable, FaTachometerAlt } from 'react-icons/fa';
import { SidebarToggle } from '../../context/SidebarToggleContext';

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
                <div className="sidebar-brand-icon rotate-n-15">
                    <i>
                        <FaLaughWink />
                    </i>
                </div>
                <div className="sidebar-brand-text mx-3">
                    SB Admin <sup>2</sup>
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
                                <i className="fa-fw">
                                    {/* <FaCog /> */}
                                </i>
                                <span>{row.menu}</span>
                            </button>
                            <div
                                id={`collapse${rowIndex}`}
                                className={`collapse ${collapsedItems[rowIndex] ? 'show' : ''}`}
                                aria-labelledby="headingTwo"
                                data-parent="#accordionSidebar"
                            >
                                <div className="bg-white py-2 collapse-inner rounded">
                                    {/* <h6 className="collapse-header">Custom Components:</h6> */}
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
                            <i className="fa-fw">
                                {/* <FaTachometerAlt /> */}
                            </i>
                            <span>{row.menu}</span>
                        </Link>
                    )}
                </li>
            ))}
        </>
    );
};


export default Sidebar;

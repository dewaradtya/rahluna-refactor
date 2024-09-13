import { Link, useForm, usePage } from '@inertiajs/react';
import { useContext, useState } from 'react';
import { FaCogs, FaSignOutAlt, FaBars, FaUser, FaKey } from 'react-icons/fa';
import { SidebarToggle } from '../../context/SidebarToggleContext';
import { FaGear } from 'react-icons/fa6';
import LogoutConfirm from '../Confirm/LogoutConfirm';

const Topbar = () => {
    const { props } = usePage();
    const { auth } = usePage().props;
    const { sidebarToggled, setSidebarToggled } = useContext(SidebarToggle);
    const [profileOpened, setProfileOpened] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Manage modal visibility
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };
    const closeDropdowns = () => {
        setProfileOpened(false);
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <form className="form-inline">
                <button
                    type="button"
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                    onClick={() => setSidebarToggled(!sidebarToggled)}
                >
                    <i>
                        <FaBars />
                    </i>
                </button>
            </form>

            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"></div>

                <li className={`nav-item dropdown no-arrow ${profileOpened ? 'show' : ''}`}>
                    <button
                        className="nav-link dropdown-toggle"
                        type="button"
                        id="userDropdown"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded={profileOpened}
                        onClick={() => setProfileOpened(!profileOpened)}
                    >
                        {auth && auth.user ? (
                            <>
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{auth.user.email}</span>
                                <img
                                    className="img-profile rounded-circle"
                                    src={
                                        auth.user.profile
                                            ? `http://localhost:8000/storage/${auth.user.profile}`
                                            : 'https://placehold.co/60x60'
                                    }
                                    alt="Profile"
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </>
                        ) : (
                            <>
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">Guest</span>
                                <img className="img-profile rounded-circle" src="https://placehold.co/60x60" />
                            </>
                        )}
                    </button>
                    <div
                        className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${profileOpened ? 'show' : ''}`}
                        aria-labelledby="userDropdown"
                    >
                        <Link className="dropdown-item" href="/user/profile" onClick={closeDropdowns}>
                            <i className="mr-2 text-gray-400">
                                <FaUser />
                            </i>
                            Profile
                        </Link>
                        <Link className="dropdown-item" href="/role" onClick={closeDropdowns}>
                            <i className="mr-2 text-gray-400">
                                <FaGear />
                            </i>
                            Setting Access
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link
                            className="dropdown-item"
                            href="#"
                            data-toggle="modal"
                            data-target="#logoutModal"
                            onClick={() => {
                                closeDropdowns();
                                openLogoutModal();
                            }}                        >
                            <i className="mr-2 text-gray-400">
                                <FaSignOutAlt />
                            </i>
                            Logout
                        </Link>
                    </div>
                </li>
                <div className={`backdrop-fade ${profileOpened ? '' : 'd-none'}`} onClick={closeDropdowns}></div>
            </ul>
            <LogoutConfirm
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={() => {
                    closeLogoutModal();
                    handleLogout();
                }}
            />
        </nav>
    );
};

export default Topbar;

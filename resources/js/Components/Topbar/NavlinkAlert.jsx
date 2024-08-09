import { Link } from '@inertiajs/react';
import { FaBell, FaDonate, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import NavLink from './Navlink';

const NavlinkAlert = ({ alertOpened, setAlertOpened }) => {
    return (
        <li className={`nav-item dropdown no-arrow mx-1 ${alertOpened ? 'show' : ''}`}>
            <NavLink
                type="button"
                className="nav-link dropdown-toggle"
                id="alertsDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                onclick={() => setAlertOpened(!alertOpened)}
                aria-expanded={alertOpened}
            >
                <i className="fa-fw">
                    <FaBell />
                </i>
                <span className="badge badge-danger badge-counter">3+</span>
            </NavLink>

            <div
                className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
                    alertOpened ? 'show' : ''
                }`}
                aria-labelledby="alertsDropdown"
            >
                <h6 className="dropdown-header">Alerts Center</h6>
                <Link className="dropdown-item d-flex align-items-center" href="#">
                    <div className="mr-3">
                        <div className="icon-circle bg-primary">
                            <i className="text-white">
                                <FaFileAlt />
                            </i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 12, 2019</div>
                        <span className="font-weight-bold">A new monthly report is ready to download!</span>
                    </div>
                </Link>
                <Link className="dropdown-item d-flex align-items-center" href="#">
                    <div className="mr-3">
                        <div className="icon-circle bg-success">
                            <i className="text-white">
                                <FaDonate />
                            </i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 7, 2019</div>
                        $290.29 has been deposited into your account!
                    </div>
                </Link>
                <Link className="dropdown-item d-flex align-items-center" href="#">
                    <div className="mr-3">
                        <div className="icon-circle bg-warning">
                            <i className="text-white">
                                <FaExclamationTriangle />
                            </i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 2, 2019</div>
                        Spending Alert: We've noticed unusually high spending for your account.
                    </div>
                </Link>
                <Link className="dropdown-item text-center small text-gray-500" href="#">
                    Show All Alerts
                </Link>
            </div>
        </li>
    );
};

export default NavlinkAlert;

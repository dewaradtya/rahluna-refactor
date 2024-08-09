import { Link } from '@inertiajs/react';
import { FaEnvelope } from 'react-icons/fa';
import Navlink from './Navlink';

const NavlinkNotif = ({ notificationOpened, setNotificationOpened }) => {
    return (
        <li className={`nav-item dropdown no-arrow mx-1 ${notificationOpened ? 'show' : ''}`}>
            <Navlink
                type="button"
                className="nav-link dropdown-toggle"
                id="messagesDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={notificationOpened}
                onClick={() => setNotificationOpened(!notificationOpened)}
            >
                <i className="fa-fw">
                    <FaEnvelope />
                </i>
                <span className="badge badge-danger badge-counter">7</span>
            </Navlink>

            <ListMessages notificationOpened={notificationOpened} />
        </li>
    );
};

const ListMessages = ({ notificationOpened }) => {
    return (
        <div
            className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
                notificationOpened ? 'show' : ''
            }`}
            aria-labelledby="messagesDropdown"
        >
            <h6 className="dropdown-header">Message Center</h6>
            <Link className="dropdown-item d-flex align-items-center" href="#">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://placehold.co/60x60" alt="..." />
                    <div className="status-indicator bg-success"></div>
                </div>
                <div className="font-weight-bold">
                    <div className="text-truncate">
                        Hi there! I am wondering if you can help me with a problem I've been having.
                    </div>
                    <div className="small text-gray-500">Emily Fowler · 58m</div>
                </div>
            </Link>
            <Link className="dropdown-item d-flex align-items-center" href="#">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://placehold.co/60x60" alt="..." />
                    <div className="status-indicator"></div>
                </div>
                <div>
                    <div className="text-truncate">
                        I have the photos that you ordered last month, how would you like them sent to you?
                    </div>
                    <div className="small text-gray-500">Jae Chun · 1d</div>
                </div>
            </Link>
            <Link className="dropdown-item d-flex align-items-center" href="#">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://placehold.co/60x60" alt="..." />
                    <div className="status-indicator bg-warning"></div>
                </div>
                <div>
                    <div className="text-truncate">
                        Last month's report looks great, I am very happy with the progress so far, keep up the good work!
                    </div>
                    <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                </div>
            </Link>
            <Link className="dropdown-item d-flex align-items-center" href="#">
                <div className="dropdown-list-image mr-3">
                    <img className="rounded-circle" src="https://placehold.co/60x60" alt="..." />
                    <div className="status-indicator bg-success"></div>
                </div>
                <div>
                    <div className="text-truncate">
                        Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if
                        they aren't good...
                    </div>
                    <div className="small text-gray-500">Chicken the Dog · 2w</div>
                </div>
            </Link>
            <Link className="dropdown-item text-center small text-gray-500" href="#">
                Read More Messages
            </Link>
        </div>
    );
};

export default NavlinkNotif;

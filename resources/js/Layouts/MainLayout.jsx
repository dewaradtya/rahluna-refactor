import { Head } from '@inertiajs/react';
import SidebarToggleContextProvider from '../context/SidebarToggleContext';
import '../../css/app.css';
import '../../css/sb-admin-2.min.css';
import Sidebar from '../Components/Sidebar/Index';
import Topbar from '../Components/Topbar/Index';
import FlashMessage from '../Components/Messages/FlashMessage';

const MainLayout = ({ children, title }) => {
    return (
        <>
            <Head title={title} />
            <div id="wrapper">
                <SidebarToggleContextProvider>
                    <FlashMessage />
                    <Sidebar />

                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <Topbar />

                            <div className="container-fluid">{children}</div>
                        </div>

                        <Footer />
                    </div>
                </SidebarToggleContextProvider>
            </div>
        </>
    );
};

const Footer = () => {
    return (
        <footer className="sticky-footer bg-white">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>
                        &copy; {new Date().getFullYear()} <strong>BGroup</strong>. All Rights Reserved.
                    </span>
                    <br />
                    <span>
                        Designed by
                        <img src="/img/logo.png" alt="Brand Icon" style={{ width: '90px', height: '30px', marginLeft: '5px' }} />
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default MainLayout;

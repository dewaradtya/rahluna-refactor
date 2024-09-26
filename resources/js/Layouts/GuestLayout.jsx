import { Head } from '@inertiajs/react';

import '../../css/app.css';
import '../../css/guest-layout.css';

const GuestLayout = ({ children, title }) => {
    return (
        <>
            <Head title={title} />
            <div className="content">
                <div className="container">
                    <div className="row align-content-center min-vh-100">
                        <div className="col-md-6 align-self-center">
                            <img
                                src="/img/ilustrasi.png"
                                alt="image"
                                className="img-fluid"
                            />
                        </div>

                        <div className="col-md-6 contents align-self-center">
                            <div className="row justify-content-center">
                                <div className="col-md-8">{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GuestLayout;

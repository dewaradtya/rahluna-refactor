import React from 'react';
import MainLayout from '../../Layouts/MainLayout';

const Profile = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <img 
                                src="/img/apple-touch-icon.png" 
                                className="img-fluid rounded-circle mb-3" 
                                alt="Profile" 
                                style={{ width: '150px', height: '150px' }} 
                            />
                            <h3 className="card-title">admin</h3>
                            <div className="d-flex justify-content-center">
                                <a href="#!" className="btn btn-primary me-2">Edit Profile</a>
                                <a href="#!" className="btn btn-secondary">Change Password</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4>Profile</h4>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-4"><strong>Email:</strong></div>
                                <div className="col-md-8">admin@rahlunaabadi.id</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4"><strong>Joined:</strong></div>
                                <div className="col-md-8">13 April 2022 07:18 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Profile.layout = (page) => <MainLayout children={page} title="Profile Page" />;

export default Profile;

import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const Profile = ({ user }) => {
    console.log(user);
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <img
                                src={user.profile ? `http://localhost:8000/storage/${user.profile}` : '/img/default-profile.png'}
                                className="img-fluid rounded-circle mb-3"
                                alt="Profile"
                                style={{ width: '150px', height: '150px' }}
                            />

                            <h3 className="card-title">{user.name}</h3>
                            <div className="d-flex justify-content-center">
                                <Link href="/profile/edit" className="btn btn-primary me-2">
                                    Edit Profile
                                </Link>
                                <Link href="profile/change-pin" className="btn btn-secondary">
                                    Change Password
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4>Profile Details</h4>
                        </div>
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col-md-4">
                                    <strong>Email:</strong>
                                </div>
                                <div className="col-md-8">{user.email}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4">
                                    <strong>Joined:</strong>
                                </div>
                                <div className="col-md-8">
                                    {new Date(user.created_at).toLocaleDateString()}{' '}
                                    {new Date(user.created_at).toLocaleTimeString()}
                                </div>
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

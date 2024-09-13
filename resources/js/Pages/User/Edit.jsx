import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { InputField, InputTextarea, InputCheckbox } from '../../Components/FieldInput';

const EditProfile = ({ user }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(user.profile ? `/storage/${user.profile}` : '/img/default-profile.png');
    const { errors } = usePage().props;

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (profilePicture) {
            formData.append('profile', profilePicture);
        }
    
        router.post('/profile/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <MainLayout title="Edit Profile">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h4>Edit Profile</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="text-center mb-4">
                                        <img 
                                            src={profilePicturePreview} 
                                            alt="Profile" 
                                            className="img-fluid rounded-circle mb-3" 
                                            style={{ width: '150px', height: '150px' }} 
                                        />
                                        <input 
                                            type="file" 
                                            className="form-control-file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                        />
                                        {errors.profile && <div className="text-danger">{errors.profile}</div>}
                                    </div>

                                    <InputField
                                        id="name"
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={errors.name}
                                    />

                                    <InputField
                                        id="email"
                                        type="email"
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={errors.email}
                                    />

                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-secondary" onClick={() => router.visit('/user/profile')}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditProfile;

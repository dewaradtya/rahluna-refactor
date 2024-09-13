import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const ChangePin = () => {
    const { data, setData, post, processing, errors } = useForm({
        old_pin: '',
        pin: '',
        pin_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/user/profile/change-pin');
    };

    return (
        <div className="card shadow-lg p-4">
            <h3 className="card-title">Change PIN</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="old_pin">Old PIN</label>
                    <input
                        type="password"
                        id="old_pin"
                        className={`form-control ${errors.old_pin ? 'is-invalid' : ''}`}
                        value={data.old_pin}
                        onChange={(e) => setData('old_pin', e.target.value)}
                    />
                    {errors.old_pin && <span className="invalid-feedback">{errors.old_pin}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="pin">New PIN</label>
                    <input
                        type="password"
                        id="pin"
                        className={`form-control ${errors.pin ? 'is-invalid' : ''}`}
                        value={data.pin}
                        onChange={(e) => setData('pin', e.target.value)}
                    />
                    {errors.pin && <span className="invalid-feedback">{errors.pin}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="pin_confirmation">Confirm New PIN</label>
                    <input
                        type="password"
                        id="pin_confirmation"
                        className={`form-control ${errors.pin_confirmation ? 'is-invalid' : ''}`}
                        value={data.pin_confirmation}
                        onChange={(e) => setData('pin_confirmation', e.target.value)}
                    />
                    {errors.pin_confirmation && (
                        <span className="invalid-feedback">{errors.pin_confirmation}</span>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Updating...' : 'Change PIN'}
                </button>
            </form>
        </div>
    );
};

ChangePin.layout = (page) => <MainLayout children={page} title="Change PIN" />;

export default ChangePin;

import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const FlashMessage = () => {
    const { flash, errors } = usePage().props;
    const formErrors = Object.keys(errors).length;

    useEffect(() => {
        formErrors > 0 &&
            toast.error(`There are ${formErrors} form errors`, {
                duration: 3000
            });

        flash?.success &&
            toast.success(flash.success, {
                duration: 3000
            });

        flash?.error &&
            toast.error(flash.error, {
                duration: 3000
            });
    }, [flash, formErrors]);

    return <Toaster position="top-center" />;
};

export default FlashMessage;

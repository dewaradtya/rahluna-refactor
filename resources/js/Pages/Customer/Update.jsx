import { useForm } from '@inertiajs/react';
import { InputField, InputTextarea } from '../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const FundingOptions = [
    { value: 'Oprasional', label: 'Oprasional' },
    { value: 'Gaji', label: 'Gaji' },
    { value: 'Fee', label: 'Fee' },
    { value: 'Bayar Pajak', label: 'Bayar Pajak' }
];

const Update = ({ showModal, setShowModal, customer }) => {
    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        name: customer.name || '',
        pic: customer.pic || '',
        telp: customer.telp || '',
        email: customer.email || '',
        address: customer.address || '',
        identity: null,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/customer/${customer.id}`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Edit Customer" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nama Customer"
                        id="name-update"
                        value={data.name}
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputField
                        label="Nama PIC"
                        id="pic-update"
                        value={data.pic}
                        error={errors?.pic}
                        onChange={(e) => setData('pic', e.target.value)}
                        required
                    />
                    <InputField
                        label="No. Telepon"
                        id="telp-update"
                        value={data.telp}
                        error={errors?.telp}
                        onChange={(e) => setData('telp', e.target.value)}
                    />
                    <InputField
                        type="email"
                        label="Email"
                        id="email-update"
                        value={data.email}
                        error={errors?.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputTextarea
                        label="Alamat"
                        id="address-update"
                        value={data.address}
                        error={errors?.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    <InputField
                        type="file"
                        label="NPWP / KTP"
                        id="identity-update"
                        error={errors?.identity}
                        onChange={(e) => setData('identity', e.target.files[0])}
                    />
                    <Modal.Footer>
                        <LoadingButton type="button" onClick={() => setShowModal(false)} loading={processing}>
                            Tutup
                        </LoadingButton>
                        <LoadingButton type="submit" loading={processing}>
                            Simpan
                        </LoadingButton>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default Update;
import { useForm } from '@inertiajs/react';
import { InputField, InputTextarea } from '../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const Create = ({ showModal, setShowModal }) => {
    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        pic: '',
        telp: '',
        email: '',
        address: '',
        identity: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Tambah Customer" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nama Customer"
                        id="name-create"
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputField
                        label="Nama PIC"
                        id="pic-create"
                        error={errors?.pic}
                        onChange={(e) => setData('pic', e.target.value)}
                        required
                    />
                    <InputField
                        label="No. Telepon"
                        id="telp-create"
                        error={errors?.telp}
                        onChange={(e) => setData('telp', e.target.value)}
                    />
                    <InputField
                        type="email"
                        label="Email"
                        id="email-create"
                        error={errors?.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputTextarea
                        label="Alamat"
                        id="address-create"
                        value={data.address}
                        error={errors?.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    <InputField
                        type="file"
                        label="NPWP / KTP"
                        id="identity-create"
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

export default Create;

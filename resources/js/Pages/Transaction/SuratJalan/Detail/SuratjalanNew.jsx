import { useForm } from '@inertiajs/react';
import { InputField, InputTextarea, Select } from '../../../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { today } from '../../../../utils';

const suratJalanNew = ({ showModal, setShowModal, customerId }) => {

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        no_surat: 0,
        date: today(),
        customer_id: customerId
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(`/transaksi/suratJalan/sjnew`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Surat Jalan Baru" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="number"
                        label="Nomor Surat Jalan"
                        id="no_surat-create"
                        error={errors?.no_surat}
                        onChange={(e) => setData('no_surat', e.target.value)}
                        required
                    />
                    <InputField
                        label="Tanggal Kirim"
                        id="tanggal_kirim-create"
                        type="date"
                        value={data.tanggal_kirim}
                        error={errors?.tanggal_kirim}
                        onChange={(e) => setData('tanggal_kirim', e.target.value)}
                        required
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

export default suratJalanNew;

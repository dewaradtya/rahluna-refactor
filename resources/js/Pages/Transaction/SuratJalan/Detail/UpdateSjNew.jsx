import { useForm } from '@inertiajs/react';
import { InputField } from '../../../../Components/FieldInput';
import { useEffect, useState } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { today } from '../../../../utils';

const updateSjNew = ({ showModal, setShowModal,suratJalanNew}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, put, errors, recentlySuccessful } = useForm({
        no_surat: suratJalanNew?.no_surat||0,
        tanggal_kirim: suratJalanNew?.tanggal_kirim||today(),
    });
 
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        put(`/transaksi/suratJalanNew/${suratJalanNew?.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
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
                        value={data.no_surat}
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
                        <LoadingButton type="button" onClick={() => setShowModal(false)} loading={isLoading}>
                            Tutup
                        </LoadingButton>
                        <LoadingButton type="submit" loading={isLoading}>
                            Simpan
                        </LoadingButton>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default updateSjNew;

import { useForm } from '@inertiajs/react';
import { InputField } from '../../../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../../../Components/Modal';
import LoadingButton from '../../../../../Components/Button/LoadingButton';
import { today } from '../../../../../utils';

const suratJalanNew = ({ showModal, setShowModal, customerId, selectedRows }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        no_surat: 0,
        tanggal_kirim: today(),
        customer_id: customerId,
        selected_rows: selectedRows 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRows.length === 0) {
            alert('Pilih minimal satu data untuk membuat surat jalan.');
            return;
        }

        post(`/transaksi/suratJalan/sjnew`, {
            preserveScroll: true,
            data: {
                ...data,
                selected_rows: selectedRows
            }
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

import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea } from '../../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../../utils';

const Create = ({ showModal, setShowModal, debtId }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        oprasional_id: debtId,
        date: today(),
        description: '',
        amount: 0,
        proof: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/hutang/detail', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Bayar Hutang" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Tanggal Bayar"
                        id="date-create"
                        type="date"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Nilai Bayar"
                        id="amount-create"
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputTextarea
                        label="Keterangan"
                        id="description-create"
                        value={data.description}
                        error={errors?.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                    />
                    <InputField
                        type="file"
                        label="Bukti"
                        id="proof-create"
                        error={errors?.proof}
                        onChange={(e) => setData('proof', e.target.files[0])}
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

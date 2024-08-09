import { useForm } from '@inertiajs/react';
import { InputField, InputCheckbox, InputNumber } from '../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const Update = ({ showModal, setShowModal, capital }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        date: capital.date || today(),
        origin: capital.origin || '',
        amount: capital.amount || 0,
        cashflow: capital.cashflow || false,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/modal/${capital.id}`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Modal" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Tanggal Perolehan"
                        id="date-update"
                        type="date"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Asal Dana"
                        id="origin-update"
                        value={data.origin}
                        error={errors?.origin}
                        onChange={(e) => setData('origin', e.target.value)}
                        required={true}
                    />
                    <InputNumber
                        label="Nilai"
                        id="nilai-update"
                        addonText={rupiah(data.amount)}
                        value={data.amount}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputCheckbox
                        label="Data inputan lama, tidak merubah cashflow."
                        id="cashflow-update"
                        checked={data.cashflow}
                        onChange={(e) => setData('cashflow', e.target.checked)}
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

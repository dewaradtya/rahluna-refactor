import { useForm } from '@inertiajs/react';
import { InputField, InputCheckbox, InputNumber, InputTextarea } from '../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const Create = ({ showModal, setShowModal }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        date: today(),
        origin: '',
        amount: 0,
        cashflow: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/transaksi/invoiceHutang', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Hutang Invoice" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Jatuh Tempo"
                        id="date-create"
                        type="date"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Asal Dana"
                        id="origin-create"
                        error={errors?.origin}
                        onChange={(e) => setData('origin', e.target.value)}
                        required={true}
                    />
                    <InputNumber
                        label="Nilai"
                        id="nilai-create"
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputCheckbox
                        label="Data inputan lama, tidak merubah cashflow."
                        id="cashflow-create"
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

export default Create;

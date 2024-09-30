import { useForm, usePage } from '@inertiajs/react';
import { Select, InputField, InputNumber } from '../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const Create = ({ showModal, setShowModal }) => {
    const {
        additional: { taxs }
    } = usePage().props;

    const TaxOptions = taxs.map(({ id, tax }) => ({ value: id, label: tax + '%' }));

    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        date: today(),
        description: '',
        amount: 0,
        funding: '',
        proof: null,
        tax_id: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/entertaint', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Tambah Entertaintment Cost" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="date"
                        label="Tanggal"
                        id="tanggal-create"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Nilai"
                        id="nilai-create"
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputField
                        label="Keterangan"
                        id="keterangan-create"
                        error={errors?.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                    />
                    <Select
                        label="Pajak"
                        id="pajak-create"
                        error={errors?.tax_id}
                        onChange={(option) => setData('tax_id', option ? option.value : null)}
                        options={TaxOptions}
                    />
                    <InputField
                        type="file"
                        label="Bukti"
                        id="bukti-create"
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

import { useForm } from '@inertiajs/react';
import { InputField, InputNumber } from '../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah } from '../../../utils';

const Update = ({ showModal, setShowModal, invoice }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        ppn_pph_customer: invoice.ppn_pph_customer || 0,
        ppn_customer: invoice.ppn_customer || 0,
        pph_customer: invoice.pph_customer || 0,
        bukti_customer: null,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/tax/ppn/${invoice.id}`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Potongan PPN dan PPH" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputNumber
                        label="PPN PPH dibayar customer"
                        id="ppn_pph_customer-update"
                        addonText={rupiah(data.ppn_pph_customer)}
                        value={data.ppn_pph_customer}
                        error={errors?.ppn_pph_customer}
                        onChange={(e) => setData('ppn_pph_customer', e.target.value)}
                        disabled 
                    />
                    <InputNumber
                        label="Nilai PPN"
                        id="ppn-update"
                        addonText={rupiah(data.ppn_customer)}
                        value={data.ppn_customer}
                        error={errors?.ppn_customer}
                        onChange={(e) => setData('ppn_customer', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Nilai PPH"
                        id="pph-update"
                        addonText={rupiah(data.pph_customer)}
                        value={data.pph_customer}
                        error={errors?.pph_customer}
                        onChange={(e) => setData('pph_customer', e.target.value)}
                        required
                    />
                    <InputField
                        type="file"
                        label="Upload File"
                        id="bukti_customer-update"
                        error={errors?.bukti_customer}
                        onChange={(e) => setData('bukti_customer', e.target.files[0])}
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

import { useForm } from '@inertiajs/react';
import { InputNumber } from '../../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { rupiah } from '../../../../utils';

const PengurangHarga = ({ showModal, setShowModal, invoice, invoiceId }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        invoice_id: invoiceId || 0,  // Fallback to 0 if undefined
        pengurang_harga: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!invoice || !invoice.id) {
            console.error('Invoice data is missing or invalid.');
            return;
        }

        post(`/transaksi/invoiceJual/pengurang/${invoice.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
            },
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Pengurang Harga Invoice" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputNumber
                        label="Pengurang Harga"
                        id="pengurang_harga"
                        addonText={rupiah(data.pengurang_harga)}
                        error={errors?.pengurang_harga}
                        value={data.pengurang_harga}
                        onChange={(e) => setData('pengurang_harga', e.target.value)}
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

export default PengurangHarga;

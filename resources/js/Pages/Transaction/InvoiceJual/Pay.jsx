import { useForm } from '@inertiajs/react';
import { InputNumber } from '../../../Components/FieldInput';
import { useEffect, useState } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah } from '../../../utils';

const Pay = ({ showModal, setShowModal, invoiceJual, invoiceJualId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        invoice_id: invoiceJualId,
        total_bayar: invoiceJual?.total_bayar || 0,
        ppn_pph_customer: invoiceJual?.ppn_pph_customer || 0,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/transaksi/invoiceJual/pay/${invoiceJual.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Bayar Hutang Invoice" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputNumber
                        label="Nilai Bayar"
                        id="total_bayar"
                        addonText={rupiah(data.total_bayar)}
                        value={data.total_bayar}
                        error={errors?.total_bayar}
                        onChange={(e) => setData('total_bayar', e.target.value)}
                    />
                    <InputNumber
                        label="PPN + PPH dibayar customer"
                        id="ppn_pph_customer"
                        addonText={rupiah(data.ppn_pph_customer)}
                        value={data.ppn_pph_customer}
                        error={errors?.ppn_pph_customer}
                        onChange={(e) => setData('ppn_pph_customer', e.target.value)}
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

export default Pay;

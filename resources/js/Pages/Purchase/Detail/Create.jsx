import { useForm } from '@inertiajs/react';
import { InputField, InputNumber} from '../../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const Create = ({ showModal, setShowModal, purchaseId }) => {
    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        product: '',
        amount: 0,
        qty: 0,
        purchase_id: purchaseId
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/purchase/detail', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Tambah data detail PO" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Produk"
                        id="product-create"
                        error={errors?.product}
                        onChange={(e) => setData('product', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Harga"
                        id="harga-create"
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputField
                        type="number"
                        label="Qty"
                        id="qty-create"
                        error={errors?.qty}
                        onChange={(e) => setData('qty', e.target.value)}
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

export default Create;

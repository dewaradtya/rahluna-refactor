import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea, Select } from '../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const Update = ({ showModal, setShowModal, purchaseDetail }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        product: purchaseDetail?.product || '',
        amount: purchaseDetail?.amount || 0,
        qty: purchaseDetail?.qty || 0,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/purchase/detail/${purchaseDetail.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit PO Detail" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="product"
                        id="product-update"
                        error={errors?.product}
                        value={data.product}
                        onChange={(e) => setData('product', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Harga"
                        id="harga-update"
                        value={data.amount}
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                     <InputField
                        type="number"
                        label="Qty"
                        id="qty-update"
                        value={data.qty}
                        error={errors?.qty}
                        onChange={(e) => setData('qty', e.target.value)}
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

export default Update;

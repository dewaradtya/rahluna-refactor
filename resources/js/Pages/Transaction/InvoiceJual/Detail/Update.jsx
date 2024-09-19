import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputPercentage, InputTextarea, Select } from '../../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../../utils';

const Update = ({ showModal, setShowModal, invoiceDetail, products }) => {
    const [isLoading, setIsLoading] = useState(false);

    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [products]
    );

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        product_id: invoiceDetail?.product_id || null,
        note: invoiceDetail?.note || '',
        purchase_price: invoiceDetail?.purchase_price || 0,
        price: invoiceDetail?.price || 0,
        qty: invoiceDetail?.qty || 0,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/transaksi/invoiceJual/detail/${invoiceDetail.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit invoice Jual" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Product"
                        id="product-update"
                        error={errors?.product_id}
                        value={options.find((option) => option.value === data.product_id)}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={options}
                        isDisabled={true}
                    />
                    <InputField
                        type="number"
                        label="Qty"
                        id="qty-update"
                        value={data.qty}
                        error={errors?.qty}
                        onChange={(e) => setData('qty', e.target.value)}
                        disabled
                    />
                    <InputNumber
                        label="Harga Beli"
                        id="purchase-price-update"
                        addonText={rupiah(data.purchase_price)}
                        value={data.purchase_price}
                        error={errors?.purchase_price}
                        onChange={(e) => setData('purchase_price', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Harga Jual"
                        id="price-update"
                        addonText={rupiah(data.price)}
                        value={data.price}
                        error={errors?.price}
                        onChange={(e) => setData('price', e.target.value)}
                        required
                    />
                    <InputTextarea
                        label="Note"
                        id="note-update"
                        value={data.note}
                        error={errors?.note}
                        onChange={(e) => setData('note', e.target.value)}
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

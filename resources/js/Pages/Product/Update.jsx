import { router, useForm } from '@inertiajs/react';
import { CreatableSelect, InputField, InputNumber } from '../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah } from '../../utils';

const Update = ({ showModal, setShowModal, units, product }) => {
    const [isLoading, setIsLoading] = useState(false);
    const options = useMemo(() => units.map((unit) => ({ value: unit.name, label: unit.name })), [units]);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        model_number: product.model_number || '',
        name: product.name || '',
        unit: product.unit || null,
        purchase_price: product.purchase_price || 0,
        price: product.price || 0,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/products/${product.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleCreatableSelect = (inputValue) => {
        setIsLoading(true);
        router.post(
            '/units',
            { name: inputValue },
            {
                onSuccess: setData('unit', inputValue),
                onFinish: () => setIsLoading(false)
            }
        );
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Hutang" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nomor Model"
                        id="model-number-update"
                        value={data.model_number}
                        error={errors?.model_number}
                        onChange={(e) => setData('model_number', e.target.value)}
                        required
                    />
                    <InputField
                        label="Nama Produk"
                        id="name-update"
                        value={data.name}
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <CreatableSelect
                        label="Satuan"
                        id="unit-update"
                        isClearable
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={(option) => setData('unit', option ? option.value : null)}
                        onCreateOption={handleCreatableSelect}
                        value={options?.find((option) => option.value === data.unit)}
                        options={options}
                    />
                    <InputField type="number" label="Stok" id="stock-update" value={product?.stock} readOnly={true} />
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

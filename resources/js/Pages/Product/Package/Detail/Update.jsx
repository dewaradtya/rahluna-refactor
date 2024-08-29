import { useForm } from '@inertiajs/react';
import { Select, InputField } from '../../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';

const Update = ({ showModal, setShowModal, productPackageDetail, products }) => {
    const [isLoading, setIsLoading] = useState(false);

    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [products]
    );

    const { data, setData, put, errors, recentlySuccessful } = useForm({
        product_id: productPackageDetail?.product_id || null,
        qty: productPackageDetail?.qty || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        put(`/products/package/detail/${productPackageDetail?.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Paket" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Product"
                        id="product-update"
                        error={errors?.product_id}
                        value={options.find((option) => option.value === data.product_id)}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={options}
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

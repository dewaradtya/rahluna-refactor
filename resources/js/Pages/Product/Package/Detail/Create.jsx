import { useForm } from '@inertiajs/react';
import { InputField, Select } from '../../../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';

const Create = ({ showModal, setShowModal, products, productPackageId }) => {
    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [products]
    );

    const { setData, post, processing, errors, recentlySuccessful } = useForm({
        product_id: '',
        product_package_id: productPackageId,
        qty: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/products/package/detail`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Produk Paket" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="product_package_id" value={productPackageId} />
                    <Select
                        label="Product"
                        id="product-create"
                        error={errors?.product_id}
                        onChange={(option) => setData('product_id', option ? option.value : '')}
                        options={options}
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

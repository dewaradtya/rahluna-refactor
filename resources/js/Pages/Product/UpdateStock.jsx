import { useForm } from '@inertiajs/react';
import { InputField, Select } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const UpdateStock = ({ showModal, setShowModal, products }) => {
    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.model_number} - ${product.name}` })),
        []
    );

    const { setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        product_id: null,
        stock: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/products/change-stock`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Stok" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Product"
                        id="product-change"
                        error={errors?.product_id}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <InputField
                        type="number"
                        label="Stok"
                        id="stock-change"
                        error={errors?.stock}
                        onChange={(e) => setData('stock', e.target.value)}
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

export default UpdateStock;
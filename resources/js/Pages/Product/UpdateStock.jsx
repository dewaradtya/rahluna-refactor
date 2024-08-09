import { useForm } from '@inertiajs/react';
import { InputField, Select } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const Create = ({ showModal, setShowModal, products }) => {
    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.model_number} - ${product.name}` })),
        [products] 
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        product_id: '',
        qty: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/products/package/detail', {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Paket Produk" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
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
                        value={data.qty}
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

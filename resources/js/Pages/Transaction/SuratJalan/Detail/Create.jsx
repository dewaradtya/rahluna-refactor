import { useForm } from '@inertiajs/react';
import { InputField, InputTextarea, Select } from '../../../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';

const Create = ({ showModal, setShowModal, products, customerId }) => {
    const options = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [products]
    );

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        product_id: null,
        qty: 0,
        note: '',
        customer_id: customerId
    });
    

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/transaksi/suratJalan`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Produk Surat Jalan" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Product"
                        id="product-create"
                        error={errors?.product_id}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
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
                    <InputTextarea
                        label="Keterangan"
                        id="note-create"
                        error={errors?.note}
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
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
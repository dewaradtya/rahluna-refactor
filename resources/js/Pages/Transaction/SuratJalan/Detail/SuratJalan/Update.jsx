import { useForm } from '@inertiajs/react';
import { Select, InputField, InputTextarea } from '../../../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../../Components/Modal';
import LoadingButton from '../../../../../Components/Button/LoadingButton';

const Update = ({ showModal, setShowModal, suratJalan, products, productPackages }) => {
    const [isLoading, setIsLoading] = useState(false);

    const productOptions = useMemo(
        () => products.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [products]
    );

    const packageOptions = useMemo(
        () => productPackages.map((packageItem) => ({ value: packageItem.id, label: `${packageItem.name} - ${packageItem.unit}` })),
        [productPackages]
    );

    const { data, setData, put, errors, recentlySuccessful } = useForm({
        product_id: suratJalan?.product_id || null,
        qty: suratJalan?.qty || 0,
        note: suratJalan?.note,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        put(`/transaksi/suratJalan/${suratJalan?.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    const isPackage = suratJalan.kategori === 'Paket';

    return (
        <Modal title={isPackage ? "Edit Paket" : "Edit Produk"} showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label={isPackage ? "Paket" : "Produk"}
                        id="product-update"
                        error={errors?.product_id}
                        value={isPackage ? packageOptions.find(option => option.value === data.product_id) : productOptions.find(option => option.value === data.product_id)}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={isPackage ? packageOptions : productOptions}
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
                    <InputTextarea
                        label="Keterangan"
                        id="note-update"
                        error={errors?.note}
                        value={data.note}
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

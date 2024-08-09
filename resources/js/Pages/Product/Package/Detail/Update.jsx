import { router, useForm } from '@inertiajs/react';
import { CreatableSelect, InputField, InputNumber } from '../../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { rupiah } from '../../../../utils';

const Update = ({ showModal, setShowModal, productPackageDetail }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        name: productPackageDetail?.name || '',
        purchase_price: productPackageDetail?.purchase_price || 0,
        price: productPackageDetail?.price || 0,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/products/package/${productPackageDetail?.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Paket" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nama Produk"
                        id="name-update"
                        value={data.name}
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
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

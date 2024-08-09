import { router, useForm } from '@inertiajs/react';
import { CreatableSelect, InputField, InputNumber } from '../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah } from '../../../utils';

const Create = ({ showModal, setShowModal, units }) => {
    const [isLoading, setIsLoading] = useState(false);
    const options = useMemo(() => units.map((unit) => ({ value: unit.name, label: unit.name })), [units]);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        name: '',
        unit: null,
        purchase_price: 0,
        price: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post('/products/package', {
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
                onSuccess: () => setData('unit', inputValue),
                onFinish: () => setIsLoading(false)
            }
        );
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Paket Produk" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nama Paket"
                        id="package-name-create"
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputNumber
                        label="Harga Jual"
                        id="price-create"
                        addonText={rupiah(data.price)}
                        error={errors?.price}
                        onChange={(e) => setData('price', e.target.value)}
                        required
                    />
                    <CreatableSelect
                        label="Satuan"
                        id="unit-create"
                        isClearable
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={(option) => setData('unit', option ? option.value : null)}
                        onCreateOption={handleCreatableSelect}
                        value={options?.find((option) => option.value === data.unit)}
                        options={options}
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

export default Create;

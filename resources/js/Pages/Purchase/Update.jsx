import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea, Select } from '../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const Update = ({ showModal, setShowModal, purchase }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        referensi: purchase?.referensi || '',
        date: purchase?.date || today(),
        supply: purchase?.supply || '',
        address: purchase?.referensi || '',
        delivery_date: purchase?.delivery_date || today(),
        tax_invoice: null,
        purchase_invoice: null,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/purchase/${purchase.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit purchase" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Referensi"
                        id="referensi-update"
                        error={errors?.referensi}
                        value={data.referensi}
                        onChange={(e) => setData('referensi', e.target.value)}
                        required
                    />
                    <InputField
                        label="Tanggal Dibuat"
                        id="date-update"
                        type="date"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <InputField
                        label="Supplier"
                        id="supply-update"
                        error={errors?.supply}
                        value={data.supply}
                        onChange={(e) => setData('supply', e.target.value)}
                        required
                    />
                    <InputTextarea
                        label="Alamat Pengiriman"
                        id="address-update"
                        value={data.address}
                        error={errors?.address}
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputField
                        label="Delivery Date"
                        id="delivery_date-update"
                        type="delivery_date"
                        value={data.delivery_date}
                        error={errors?.delivery_date}
                        onChange={(e) => setData('delivery_date', e.target.value)}
                        required
                    />
                    <InputField
                        type="file"
                        label="Faktur Pajak"
                        id="faktur-update"
                        error={errors?.tax_invoice}
                        onChange={(e) => setData('tax_invoice', e.target.files[0])}
                    />
                    <InputField
                        type="file"
                        label="Invoice Beli"
                        id="invoice-update"
                        error={errors?.purchase_invoice}
                        onChange={(e) => setData('purchase_invoice', e.target.files[0])}
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

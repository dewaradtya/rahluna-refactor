import { useForm, usePage } from '@inertiajs/react';
import { Select, InputField, InputNumber, InputTextarea, InputPercentage } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const Create = ({ showModal, setShowModal, project }) => {
    const options = useMemo(
        () =>
            project.map((project) => ({
                value: project.id,
                label: `${project.name} - ${project.customer?.name || 'No Customer'}`
            })),
        [project]
    );

    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        date: today(),
        referensi: '',
        project_id: null,
        address: '',
        supply: '',
        delivery_date: today(),
        discount: 0,
        tax_invoice: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/purchase', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Form PO" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="date"
                        label="Tanggal Dibuat"
                        id="tanggal-create"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <InputField
                        label="Referensi"
                        id="referensi-create"
                        error={errors?.referensi}
                        onChange={(e) => setData('referensi', e.target.value)}
                        required
                    />
                    <Select
                        label="Project"
                        id="project-create"
                        error={errors?.project_id}
                        onChange={(option) => setData('project_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <InputField
                        label="Supplier"
                        id="supply-create"
                        error={errors?.supply}
                        onChange={(e) => setData('supply', e.target.value)}
                        required
                    />
                    <InputTextarea
                        label="Alamat Pengiriman"
                        id="address-create"
                        value={data.address}
                        error={errors?.address}
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputField
                        type="date"
                        label="Delivery Date"
                        id="delivery_date-create"
                        value={data.delivery_date}
                        error={errors?.delivery_date}
                        onChange={(e) => setData('delivery_date', e.target.value)}
                        required
                    />
                    <InputPercentage
                        label="Discount"
                        id="discount-create"
                        value={data.discount}
                        onChange={(e) => setData('discount', e.target.value)}
                        error={errors?.discount}
                    />
                    <InputField
                        type="file"
                        label="Faktur Pajak"
                        id="faktur-create"
                        error={errors?.tax_invoice}
                        onChange={(e) => setData('tax_invoice', e.target.files[0])}
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

import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea, Select } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const MaterialStok = ({ showModal, setShowModal, product, projects }) => {
    console.log(projects)
    const options = useMemo(
        () => product.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [product]
    );

    const ProjectsOptions = useMemo(
        () => projects.map((projects) => ({ value: projects.id, label: `${projects.name} - ${projects.customer.name}` })),
        [projects]
    );

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        date: today(),
        product_id: null,
        amount: 0,
        qty: 0,
        note: '',
        project_id: null
    });
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data)
        post(`/project/detail/material`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Material Stok Project" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="date"
                        label="Tanggal"
                        id="tanggal-create"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <Select
                        label="Nama Project"
                        id="project-create"
                        error={errors?.project_id}
                        onChange={(option) => setData('project_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <Select
                        label="Jenis Barang"
                        id="product-create"
                        error={errors?.product_id}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <InputNumber
                        label="Nilai"
                        id="nilai-create"
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
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
                        value={data.note}
                        error={errors?.note}
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

export default MaterialStok;
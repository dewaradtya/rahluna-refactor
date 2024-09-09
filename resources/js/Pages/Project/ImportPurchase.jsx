import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea, Select } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const ImportPurchase = ({ showModal, setShowModal, product, projects }) => {
    const options = useMemo(
        () => product.map((product) => ({ value: product.id, label: `${product.name} - ${product.unit}` })),
        [product]
    );

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        product_id: null,
        project_id: null
    });

    const ProjectsOptions = useMemo(
        () => projects.map((projects) => ({ value: projects.id, label: `${projects.name} - ${projects.customer.name}` })),
        [projects]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(`/project/detail/material`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Import Purchase" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Nama Project"
                        id="project-create"
                        error={errors?.project_id}
                        onChange={(option) => setData('project_id', option ? option.value : null)}
                        options={ProjectsOptions}
                        required
                    />
                    <Select
                        label="No. Referensi"
                        id="product-create"
                        error={errors?.product_id}
                        onChange={(option) => setData('product_id', option ? option.value : null)}
                        options={options}
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

export default ImportPurchase;

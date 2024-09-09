import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, Select } from '../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const StatusOptions = [
    { value: 'selesai', label: 'Selesai' },
    { value: 'berlangsung', label: 'Berlangsung' }
];

const Update = ({ showModal, setShowModal, project, customers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const options = useMemo(() => customers.map((customer) => ({ value: customer.id, label: `${customer.name}` })), [customers]);

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        customer_id: project?.customer_id || null,
        name: project?.name || '',
        deadline: project?.deadline || today(),
        nilai_penawaran: project?.nilai_penawaran || 0,
        status: project?.status || '',
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/projects/done/${project.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Project" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nama Project"
                        id="name-update"
                        error={errors?.name}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <Select
                        label="User"
                        id="customer-update"
                        error={errors?.customer_id}
                        value={options.find((option) => option.value === data.customer_id)}
                        onChange={(option) => setData('customer_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <InputNumber
                        label="Nilai Penawaran"
                        id="nilai-update"
                        value={data.nilai_penawaran}
                        addonText={rupiah(data.nilai_penawaran)}
                        error={errors?.nilai_penawaran}
                        onChange={(e) => setData('nilai_penawaran', e.target.value)}
                        required
                    />
                    <InputField
                        label="Tanggal Selesai"
                        id="deadline-update"
                        type="date"
                        value={data.deadline}
                        error={errors?.deadline}
                        onChange={(e) => setData('deadline', e.target.value)}
                        required
                    />
                    <Select
                        label="Status"
                        id="status-update"
                        value={StatusOptions.find((option) => option.value === data.status)}
                        error={errors?.status}
                        onChange={(option) => setData('status', option ? option.value : null)}
                        options={StatusOptions}
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

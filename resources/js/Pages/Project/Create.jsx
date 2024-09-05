import { useForm } from '@inertiajs/react';
import { InputField, InputNumber, InputTextarea, Select } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const Create = ({ showModal, setShowModal, customers, }) => {
    const options = useMemo(
        () => customers.map((customer) => ({ value: customer.id, label: `${customer.name}` })),
        [customers]
    );

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        customer_id: null,
        name: '',
        deadline: today(),
        nilai_penawaran: 0,
    });
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data)
        post(`/project`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Projek Surat Jalan" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Select
                        label="User"
                        id="user-create"
                        error={errors?.customer_id}
                        onChange={(option) => setData('customer_id', option ? option.value : null)}
                        options={options}
                        required
                    />
                    <InputField
                        label="Nama Projek"
                        id="name-create"
                        error={errors?.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputField
                        label="Deadline"
                        id="deadline-create"
                        type="date"
                        value={data.deadline}
                        error={errors?.deadline}
                        onChange={(e) => setData('deadline', e.target.value)}
                        required={true}
                    />
                    <InputNumber
                        label="Nilai Penawaran"
                        id="nilai-create"
                        addonText={rupiah(data.nilai_penawaran)}
                        error={errors?.nilai_penawaran}
                        onChange={(e) => setData('nilai_penawaran', e.target.value)}
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
import { useForm } from '@inertiajs/react';
import { InputField } from '../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';

const ImportExcel = ({ showModal, setShowModal, projectId }) => {
    const { setData, post, processing, errors, recentlySuccessful } = useForm({
        file: null, 
        project_id: projectId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/project/detail/import`, {
            preserveScroll: true,
            forceFormData: true, 
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Import Project" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="file"
                        label="File Excel"
                        id="file-excel-import"
                        error={errors?.file} 
                        onChange={(e) => setData('file', e.target.files[0])}
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

export default ImportExcel;

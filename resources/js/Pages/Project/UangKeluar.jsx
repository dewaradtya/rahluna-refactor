import { useForm, usePage } from '@inertiajs/react';
import { Select, InputField, InputNumber, InputCheckbox } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const RequirementOptions = [
    { value: 'Material', label: 'Material' },
    { value: 'Pekerja', label: 'Pekerja' },
    { value: 'Oprasional', label: 'Oprasional' },
    { value: 'Aset', label: 'Aset' },
    { value: 'Sewa Alat', label: 'Sewa Alat' },
    { value: 'Konsumsi', label: 'Konsumsi' },
    { value: 'Trasnsport', label: 'Trasnsport' }
];

const UangKeluar = ({ showModal, setShowModal, projects }) => {
    const {
        additional: { taxs }
    } = usePage().props;

    const options = useMemo(() => projects.map((project) => ({ value: project.id, label: `${project.name}` })), [projects]);

    const TaxOptions = taxs.map(({ id, tax }) => ({ value: id, label: tax + '%' }));

    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        date: today(),
        project_id: null,
        note: '',
        amount: 0,
        pph_value: 0,
        requirement: '',
        proof: null,
        tax_id: null,
        debt_info: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/project/uangKeluar', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Uang Keluar Project" showModal={showModal} setShowModal={setShowModal}>
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
                        label="Kebutuhan"
                        id="kebutuhan-create"
                        error={errors?.requirement}
                        onChange={(option) => setData('requirement', option ? option.value : null)}
                        options={RequirementOptions}
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
                        label="Keterangan"
                        id="keterangan-create"
                        error={errors?.note}
                        onChange={(e) => setData('note', e.target.value)}
                        required
                    />
                    <Select
                        label="Pajak"
                        id="pajak-create"
                        error={errors?.tax_id}
                        onChange={(option) => setData('tax_id', option ? option.value : null)}
                        options={TaxOptions}
                    />
                    <InputCheckbox
                        label="Hutang"
                        id="pph-create"
                        checked={data.debt_info === 1} 
                        onChange={(e) => setData('debt_info', e.target.checked ? 1 : 0)}
                    />
                    <InputField
                        type="file"
                        label="Bukti"
                        id="bukti-create"
                        error={errors?.proof}
                        onChange={(e) => setData('proof', e.target.files[0])}
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

export default UangKeluar;

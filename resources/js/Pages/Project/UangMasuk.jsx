import { useForm, usePage } from '@inertiajs/react';
import { Select, InputField, InputNumber } from '../../Components/FieldInput';
import { useEffect, useMemo } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';
import { rupiah, today } from '../../utils';

const FundingOptions = [
    { value: 'Oprasional', label: 'Oprasional' },
    { value: 'Gaji', label: 'Gaji' },
    { value: 'Fee', label: 'Fee' },
    { value: 'Bayar Pajak', label: 'Bayar Pajak' },
    { value: 'Entertaint Cost', label: 'Entertaint Cost' }
];

const UangMasuk = ({ showModal, setShowModal, projects }) => {
    const {
        additional: { taxs }
    } = usePage().props;

    const options = useMemo(
        () => projects.map((project) => ({ value: project.id, label: `${project.name}` })),
        [projects]
    );

    const TaxOptions = taxs.map(({ id, tax }) => ({ value: id, label: tax + '%' }));

    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        date: today(),
        project_id: null,
        note: '',
        amount: 0,
        pph_value: 0,
        proof: null,
        tax_id: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/project/uangMasuk', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    return (
        <Modal title="Uang Masuk Project" showModal={showModal} setShowModal={setShowModal}>
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
                    <InputField
                        type="number"
                        label="Tambah PPH"
                        id="pph-create"
                        error={errors?.pph_value}
                        onChange={(e) => setData('pph_value', e.target.value)}
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

export default UangMasuk;

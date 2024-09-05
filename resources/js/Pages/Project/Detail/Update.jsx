import { useForm, usePage } from '@inertiajs/react';
import { Select, InputField, InputNumber } from '../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { rupiah, today } from '../../../utils';

const RequirementOptions = [
    { value: 'Material', label: 'Material' },
    { value: 'Pekerja', label: 'Pekerja' },
    { value: 'Oprasional', label: 'Oprasional' },
    { value: 'Aset', label: 'Aset' },
    { value: 'Sewa Alat', label: 'Sewa Alat' },
    { value: 'Konsumsi', label: 'Konsumsi' },
    { value: 'Trasnsport', label: 'Trasnsport' },
    { value: 'Uang Masuk', label: 'Uang Masuk' }
];

const Update = ({ showModal, setShowModal, projectDetail }) => {
    const {
        additional: { taxs }
    } = usePage().props;

    const TaxOptions = taxs.map(({ id, tax }) => ({ value: id, label: tax + '%' }));

    const { setData, data, post, processing, errors, recentlySuccessful } = useForm({
        date: projectDetail?.date || today(),
        note: projectDetail?.note || '',
        amount: projectDetail?.amount || 0,
        requirement: projectDetail?.requirement || '',
        proof: null,
        tax_id: projectDetail.tax_id || null,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/project/detail/${projectDetail.id}`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful]);

    const isUangMasuk = data.requirement === 'Uang Masuk';

    return (
        <Modal title="Update Project" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="date"
                        label="Tanggal"
                        id="tanggal-update"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
                        required
                    />
                    <Select
                        label="Kebutuhan"
                        id="kebutuhan-update"
                        value={RequirementOptions.find((option) => option.value === data.requirement)}
                        error={errors?.requirement}
                        onChange={(option) => !isUangMasuk && setData('requirement', option ? option.value : null)}
                        options={RequirementOptions}
                        required
                        isDisabled={isUangMasuk} // Disable the select field if the requirement is "Uang Masuk"
                    />
                    <InputNumber
                        label="Nilai"
                        id="nilai-update"
                        value={data.amount}
                        addonText={rupiah(data.amount)}
                        error={errors?.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        required
                    />
                    <InputField
                        label="Keterangan"
                        id="keterangan-update"
                        value={data.note}
                        error={errors?.note}
                        onChange={(e) => setData('note', e.target.value)}
                        required
                    />
                    <Select
                        label="Pajak"
                        id="pajak-update"
                        value={TaxOptions.find((option) => option.value === data.tax_id)}
                        error={errors?.tax_id}
                        onChange={(option) => setData('tax_id', option ? option.value : null)}
                        options={TaxOptions}
                    />
                    <InputField
                        type="file"
                        label="Bukti"
                        id="bukti-update"
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

export default Update;

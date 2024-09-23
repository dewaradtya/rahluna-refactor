import { useForm } from '@inertiajs/react';
import { InputField, InputPercentage, InputTextarea, Select } from '../../../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../../../Components/Modal';
import LoadingButton from '../../../../Components/Button/LoadingButton';
import { today } from '../../../../utils';

const InvoiceModal = ({ showModal, setShowModal, customerId, selectedSuratJalanNewRows }) => {
    const PpnOptions = [
        { value: 0, label: 'pilih' },
        { value: 10, label: '10%' },
        { value: 11, label: '11%' }
    ];

    const { data, setData, post, processing, errors, recentlySuccessful, hasErrors } = useForm({
        referensi: '',
        tanggal_dibuat: today(),
        nama_invoice: '',
        payment_term: '',
        kwitansi: '',
        note: '',
        discount: 0,
        due_date: today(),
        ppn: '',
        faktur_pajak: null,
        customer_id: customerId,
        selected_surat_jalan_new_rows: selectedSuratJalanNewRows
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSuratJalanNewRows.length === 0) {
            alert('Pilih minimal satu data untuk membuat invoice.');
            return;
        }

        post(`/transaksi/suratJalan/invoice`, {
            preserveScroll: true,
            data: {
                ...data,
                selected_surat_jalan_new_rows: selectedSuratJalanNewRows
            }
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Invoice" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Tanggal Dibuat"
                        id="date-update"
                        type="date"
                        value={data.tanggal_dibuat}
                        error={errors?.tanggal_dibuat}
                        onChange={(e) => setData('tanggal_dibuat', e.target.value)}
                        required
                    />
                    <InputField
                        label="Referensi"
                        id="referensi-update"
                        error={errors?.referensi}
                        value={data.referensi}
                        onChange={(e) => setData('referensi', e.target.value)}
                        required
                    />
                    <InputField
                        label="Nama Invoice"
                        id="nama_invoice-update"
                        error={errors?.nama_invoice}
                        value={data.nama_invoice}
                        onChange={(e) => setData('nama_invoice', e.target.value)}
                        required
                    />
                    <InputField
                        label="Payment term"
                        id="payment_term-update"
                        error={errors?.payment_term}
                        value={data.payment_term}
                        onChange={(e) => setData('payment_term', e.target.value)}
                        required
                    />
                    <InputField
                        label="Kwitansi"
                        id="kwitansi-update"
                        error={errors?.kwitansi}
                        value={data.kwitansi}
                        onChange={(e) => setData('kwitansi', e.target.value)}
                        required
                    />
                    <InputField
                        label="Jatuh Tempo"
                        id="due_date-update"
                        type="date"
                        value={data.due_date}
                        error={errors?.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        required
                    />
                    <InputPercentage
                        label="Discount"
                        id="discount-update"
                        value={data.discount}
                        onChange={(e) => setData('discount', e.target.value)}
                        error={errors?.discount}
                    />
                    <InputTextarea
                        label="Note"
                        id="note-update"
                        value={data.note}
                        error={errors?.note}
                        onChange={(e) => setData('note', e.target.value)}
                        required
                    />
                    <Select
                        label="Tambah PPN"
                        id="ppn-update"
                        value={PpnOptions.find((option) => option.value === data.ppn) || PpnOptions[0]}
                        error={errors?.ppn}
                        onChange={(option) => setData('ppn', option ? option.value : 0)}
                        options={PpnOptions}
                    />
                    <InputField
                        type="file"
                        label="Faktur Pajak"
                        id="faktur-update"
                        error={errors?.faktur_pajak}
                        onChange={(e) => setData('faktur_pajak', e.target.files[0])}
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

export default InvoiceModal;

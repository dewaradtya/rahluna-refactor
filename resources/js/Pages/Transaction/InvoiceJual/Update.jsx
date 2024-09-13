import { useForm } from '@inertiajs/react';
import { InputField, InputPercentage, InputTextarea, Select } from '../../../Components/FieldInput';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../Components/Modal';
import LoadingButton from '../../../Components/Button/LoadingButton';
import { today } from '../../../utils';

const Update = ({ showModal, setShowModal, invoiceJual }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const PpnOptions = [
        { value: invoiceJual.totalinvoice * 10 / 100, label: '10%' },
        { value: invoiceJual.totalinvoice * 11 / 100, label: '11%' }
    ];

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        referensi: invoiceJual?.referensi || '',
        date: invoiceJual?.date || today(),
        nama_invoice: invoiceJual?.nama_invoice || '',
        payment_term: invoiceJual?.payment_term || '',
        kwitansi: invoiceJual?.kwitansi || '',
        note: invoiceJual?.note || '',
        discount: invoiceJual?.discount || 0,
        due_date: invoiceJual?.due_date || today(),
        nilai_ppn: invoiceJual?.nilai_ppn || '',
        faktur_pajak: null,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(`/transaksi/invoiceJual/${invoiceJual.id}`, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit invoice Jual" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Referensi"
                        id="referensi-update"
                        error={errors?.referensi}
                        value={data.referensi}
                        onChange={(e) => setData('referensi', e.target.value)}
                        required
                    />
                    <InputField
                        label="Tanggal Dibuat"
                        id="date-update"
                        type="date"
                        value={data.date}
                        error={errors?.date}
                        onChange={(e) => setData('date', e.target.value)}
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
                        id="nilai_ppn-update"
                        value={PpnOptions.find((option) => option.value === data.nilai_ppn)}
                        error={errors?.nilai_ppn}
                        onChange={(option) => setData('nilai_ppn', option ? option.value : null)}
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

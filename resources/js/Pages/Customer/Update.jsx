import { useForm } from '@inertiajs/react';
import { InputField, InputTextarea } from '../../Components/FieldInput';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const Detail = ({ showModal, setShowModal, customer }) => {
    return (
        <Modal title="Detail Customer" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <div className="grid gap-4">
                    <InputField
                        label="Nama Customer"
                        id="name-detail"
                        value={customer.name || ''}
                        readOnly
                    />
                    <InputField
                        label="Nama PIC"
                        id="pic-detail"
                        value={customer.pic || ''}
                        readOnly
                    />
                    <InputField
                        label="No. Telepon"
                        id="telp-detail"
                        value={customer.telp || ''}
                        readOnly
                    />
                    <InputField
                        type="email"
                        label="Email"
                        id="email-detail"
                        value={customer.email || ''}
                        readOnly
                    />
                    <InputTextarea
                        label="Alamat"
                        id="address-detail"
                        value={customer.address || ''}
                        readOnly
                    />
                    {customer.identity && (
                        <div className="flex justify-center">
                            <img src={customer.identity} alt="Customer Identity" className="max-w-full h-auto" />
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <LoadingButton type="button" onClick={() => setShowModal(false)}>
                    Tutup
                </LoadingButton>
            </Modal.Footer>
        </Modal>
    );
};

export default Detail;

import { useForm } from '@inertiajs/react';
import { CreatableSelect, Select, InputField, InputCheckbox } from '../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const Create = ({ showModal, setShowModal, menus, groupMenus }) => {
    const MainMenuOptions = menus.map((menu) => ({ value: menu.id, label: menu.menu }));
    const GroupMenuOptions = groupMenus.map((menu) => ({ value: menu, label: menu }));

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        menu: '',
        url: '',
        icon: '',
        group_menu: null,
        main_menu: null,
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/menu', {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Tambah Menu" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Menu"
                        id="menu-create"
                        error={errors?.menu}
                        onChange={(e) => setData('menu', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Url"
                        id="url-create"
                        error={errors?.url}
                        onChange={(e) => setData('url', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Ikon"
                        id="icon-create"
                        error={errors?.icon}
                        onChange={(e) => setData('icon', e.target.value)}
                    />
                    <Select
                        label="Menu Utama"
                        id="main-menu-create"
                        error={errors?.main_menu}
                        options={MainMenuOptions}
                        onChange={(option) => setData('main_menu', option ? option.value : null)}
                    />
                    <CreatableSelect
                        label="Grup Menu"
                        id="group-menu-create"
                        error={errors?.group_menu}
                        options={GroupMenuOptions}
                        onChange={(option) => setData('group_menu', option ? option.value : null)}
                        required
                    />
                    <InputCheckbox
                        label="Aktif"
                        id="remember-create"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <Modal.Footer>
                        <LoadingButton type="button" onClick={() => setShowModal(false)} loading={processing}>
                            Close
                        </LoadingButton>
                        <LoadingButton type="submit" loading={processing}>
                            Submit
                        </LoadingButton>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default Create;

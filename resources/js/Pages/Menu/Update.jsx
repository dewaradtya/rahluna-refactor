import { useForm } from '@inertiajs/react';
import { CreatableSelect, Select, InputField, InputCheckbox } from '../../Components/FieldInput';
import { useEffect } from 'react';
import Modal from '../../Components/Modal';
import LoadingButton from '../../Components/Button/LoadingButton';

const Update = ({ showModal, setShowModal, dataMenu, menus, groupMenus }) => {
    const MainMenuOptions = menus.map((menu) => ({ value: menu.id, label: menu.menu }));
    const GroupMenuOptions = groupMenus.map((menu) => ({ value: menu, label: menu }));

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        menu: dataMenu.menu || '',
        url: dataMenu.url || '',
        icon: dataMenu.icon || '',
        group_menu: dataMenu.group_menu || null,
        main_menu: dataMenu.main_menu || null,
        is_active: dataMenu.is_active || false,
        _method: 'put'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/menu/${dataMenu.id}`, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (recentlySuccessful) setShowModal(false);
    }, [recentlySuccessful, setShowModal]);

    return (
        <Modal title="Edit Menu" showModal={showModal} setShowModal={setShowModal}>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Menu"
                        id="menu-update"
                        value={data.menu}
                        error={errors?.menu}
                        onChange={(e) => setData('menu', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Url"
                        id="url-update"
                        value={data.url}
                        error={errors?.url}
                        onChange={(e) => setData('url', e.target.value)}
                        required={true}
                    />
                    <InputField
                        label="Ikon"
                        id="icon-update"
                        value={data.icon}
                        error={errors?.icon}
                        onChange={(e) => setData('icon', e.target.value)}
                    />
                    <Select
                        label="Menu Utama"
                        id="main-menu-update"
                        value={MainMenuOptions.find((option) => option.value === data.main_menu)}
                        error={errors?.main_menu}
                        options={MainMenuOptions}
                        onChange={(option) => setData('main_menu', option ? option.value : null)}
                    />
                    <CreatableSelect
                        label="Grup Menu"
                        id="group-menu-update"
                        value={GroupMenuOptions.find((option) => option.value === data.group_menu)}
                        error={errors?.group_menu}
                        options={GroupMenuOptions}
                        onChange={(option) => setData('group_menu', option ? option.value : null)}
                        required
                    />
                    <InputCheckbox
                        label="Aktif"
                        id="remember-update"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
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

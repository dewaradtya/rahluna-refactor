import GuestLayout from '../../Layouts/GuestLayout';

const Login = () => {
    return (
        <>
            <div>
                <h2 className='mb-0'>Masuk</h2>
                <p className="mb-4 text-muted">Masukkan pin untuk login (6 digit)</p>
            </div>
            <form action="">
                <label className="input w-100 mb-2">
                    <input type="password" maxLength={6} className="input__field" placeholder="Pin..." required />
                    <span className="input__label">Masukkan Pin</span>
                </label>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" value="remember" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                        Ingat saya
                    </label>
                </div>
                <button type="submit" className="btn btn-block btn-primary">
                    Login
                </button>
            </form>
        </>
    );
};

Login.layout = (page) => <GuestLayout children={page} title="Login Page" />;

export default Login;

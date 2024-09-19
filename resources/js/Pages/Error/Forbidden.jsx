const Forbidden = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center text-center" style={{ height: '100vh' }}>
            <div>
                <h1 className="display-1 fw-bold text-primary">403 - Forbidden</h1>
                <p className="lead">Halaman ini tidak dapat diakses oleh anda!</p>
                <a href="/" className="btn btn-primary mt-3">
                    Kembali ke Beranda
                </a>
            </div>
        </div>
    );
};

export default Forbidden;

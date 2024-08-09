const LoadingButton = ({ onClick, loading, loadingText = 'Loading...', children, type = 'button', ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <button
            type={type}
            className={`btn btn-${type === 'submit' ? 'primary' : 'secondary'}`}
            disabled={loading}
            {...linkProps}
        >
            {type === 'submit' && loading && loadingText ? loadingText : children}
        </button>
    );
};

export default LoadingButton;

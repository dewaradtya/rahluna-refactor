const SplitButton = ({ color, text, icon, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <button type="button" className={`btn btn-${color} btn-icon-split btn-sm mb-1 shadow-sm`} {...linkProps}>
            <span className="icon text-white-50">
                <i>{icon}</i>
            </span>
            <span className="text">{text}</span>
        </button>
    );
};

export default SplitButton;

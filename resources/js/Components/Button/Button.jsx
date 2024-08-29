const Button = ({ text, color, bgcolor, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <button
            type="button"
            className="btn p-2 mx-2 mr-1"
            style={{ backgroundColor: bgcolor, borderColor: bgcolor, color: color }}
            {...linkProps}
        >
            {text}
        </button>
    );
};

export default Button;

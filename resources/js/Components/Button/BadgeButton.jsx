const BadgeButton = ({ text,color, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }
    return (
        <button type="button" className={`badge badge-${color} border-0 mr-1`} {...linkProps}>
            {text}
        </button>
    );
};

export default BadgeButton;

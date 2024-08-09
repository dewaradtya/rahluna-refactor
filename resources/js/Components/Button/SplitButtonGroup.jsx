import { useState } from 'react';

const dropdownOpenStyle = {
    position: 'absolute',
    transform: 'translate3d(0, 31px, 0)',
    top: '0px',
    left: '-15px',
    willChange: 'transform'
};

const SplitButtonGroup = ({ color, text, icon, dropdownOpen, setDropdownOpen, onClick, children, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <div className="btn-group">
            <button type="button" className={`btn btn-${color} btn-icon-split btn-sm mb-1 shadow-sm`} {...linkProps}>
                <span className="icon text-white-50">
                    <i>{icon}</i>
                </span>
                <span className="text">{text}</span>
            </button>
            <button
                type="button"
                className={`btn btn-${color} btn-sm dropdown-toggle mb-1 dropdown-toggle-split`}
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <span className="sr-only">Toggle Dropdown</span>
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={dropdownOpen ? dropdownOpenStyle : null}>
                {children}
            </div>
        </div>
    );
};

const Button = ({ text, dropdownOpen, setDropdownOpen, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <button type="button" className="dropdown-item" onClick={() => setDropdownOpen(!dropdownOpen)} {...linkProps}>
            {text}
        </button>
    );
};

const Link = ({ text, href, dropdownOpen, setDropdownOpen, onClick, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onClick) {
        linkProps.onClick = onClick;
    }

    return (
        <a className="dropdown-item" href={href} onClick={() => setDropdownOpen(!dropdownOpen)} {...linkProps}>
            Download Format
        </a>
    );
};

SplitButtonGroup.Button = Button;
SplitButtonGroup.Link = Link;
export default SplitButtonGroup;
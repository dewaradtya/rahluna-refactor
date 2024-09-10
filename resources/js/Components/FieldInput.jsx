import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

export const InputField = ({ type = 'text', className = 'form-control', id, label, onChange, error = null, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input type={type} id={id} name={id} className={`${className} ${error ? 'is-invalid' : ''}`} {...linkProps} />
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

export const InputNumber = ({ className = 'form-control', id, label, addonText, onChange, error = null, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <div className="input-group mb-3">
                <input type="number" id={id} name={id} min="0" step="0.01" className={`${className} ${error ? 'is-invalid' : ''}`} {...linkProps} />
                <span className="input-group-text" id="basic-addon2">
                    {addonText}
                </span>
            </div>
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

export const InputPercentage = ({ className = 'form-control', id, label, onChange, error = null, ...props }) => {
    const linkProps = {
        ...props,
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <div className="input-group mb-3">
                <input
                    type="number"
                    id={id}
                    name={id}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`${className} ${error ? 'is-invalid' : ''}`}
                    {...linkProps}
                />
                <span className="input-group-text">%</span>
            </div>
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

export const InputTextarea = ({ id, label, value = '', onChange, error = null, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <textarea name={id} id={id} className={`form-control ${error ? 'is-invalid' : ''}`} value={value} {...linkProps} />
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

export const InputCheckbox = ({ id, label, value = true, onChange, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group form-check">
            <input className="form-check-input" type="checkbox" name={id} value={value} id={id} {...linkProps} />
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
};

const CustomSelect = ({ className = '', label, id, onChange, error = null, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <Select
                id={id}
                name={id}
                className={error ? 'border border-danger rounded is-invalid' : ''}
                isClearable
                {...linkProps}
            />
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

const CustomCreatableSelect = ({ className = '', label, id, onChange, error, ...props }) => {
    const linkProps = {
        ...props
    };

    if (onChange) {
        linkProps.onChange = onChange;
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <CreatableSelect
                id={id}
                name={id}
                className={error ? 'border border-danger rounded is-invalid' : ''}
                isClearable
                {...linkProps}
            />
            {error ? <div className="invalid-feedback">{error}</div> : ''}
        </div>
    );
};

export { CustomSelect as Select, CustomCreatableSelect as CreatableSelect };

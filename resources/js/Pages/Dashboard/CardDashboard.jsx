import React from 'react';

export const CardDashboard = ({ textTitle, nominal, satuan, percent, color, chart, size, bgcolor, textcolor }) => {
    const backgroundColor = color === 'green' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

    return (
        <div className={`card shadow bg-${bgcolor} text-${textcolor} h-100`} style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <h5 className="card-title" style={{ position: 'relative' }}>
                    <span
                        style={{ fontSize: '0.75em', verticalAlign: 'super' }}
                        className={`text-secondary mr-1 text-${textcolor}`}
                    >
                        {satuan}
                    </span>
                    <span style={{ fontSize: '1 em', fontWeight: 'bold' }}>{nominal}</span>
                    <span
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            marginLeft: '5px',
                            fontSize: '0.75em',
                            fontWeight: 'bold',
                            backgroundColor: backgroundColor,
                            color: color,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}
                    >
                        {percent}
                    </span>
                </h5>
                <p className={`text-secondary text-${textcolor}`} style={{ marginTop: '-10px' }}>
                    {textTitle}
                </p>
                <canvas id={chart} className={`w-${size} h-${size} mt-3`} ></canvas>
            </div>
        </div>
    );
};

export const BigCardDashboard = ({ textTitle1, description1, description2, nominal, satuan, percent, color, chart }) => {
    const backgroundColor = color === 'green' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

    return (
        <div className="card shadow h-100" style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="card-title" style={{ fontWeight: 'bold', position: 'relative' }}>
                            {textTitle1}
                        </h5>
                        <p className="text-secondary" style={{ marginTop: '-10px' }}>
                            {description1}
                        </p>
                    </div>
                </div>
                <h5 className="card-title mt-4">
                    <span style={{ fontSize: '0.75em', verticalAlign: 'super' }} className="text-secondary mr-1">
                        {satuan}
                    </span>
                    <span style={{ fontSize: '1 em', fontWeight: 'bold' }}>{nominal}</span>
                    <span
                        className="ms-2"
                        style={{
                            fontSize: '0.9em',
                            fontWeight: 'bold',
                            backgroundColor: backgroundColor,
                            color: color,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}
                    >
                        {percent}
                    </span>
                </h5>
                <p className="text-secondary" style={{ marginTop: '-10px' }}>
                    {description2}
                </p>
                    <canvas id={chart} className="mt-4"></canvas>
            </div>
        </div>
    );
};

export const CardTableDashboard = ({ satuan, nominal, percent, textTitle, columns, data, color }) => {
    const backgroundColor = color === 'green' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

    return (
        <div className="card shadow h-100" style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <h5 className="card-title" style={{ position: 'relative' }}>
                    <span style={{ fontSize: '0.75em', verticalAlign: 'super' }} className="text-secondary mr-1">
                        {satuan}
                    </span>
                    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>{nominal}</span>
                    <span
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            marginLeft: '5px',
                            fontSize: '0.75em',
                            fontWeight: 'bold',
                            backgroundColor: backgroundColor,
                            color: color,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}
                    >
                        {percent}
                    </span>
                </h5>
                <p className="text-secondary" style={{ marginTop: '-10px' }}>
                    {textTitle}
                </p>
                <div style={{ maxHeight: '270px', overflowY: 'auto' }}>
                    <table className="table table-hover">
                        <thead className="table">
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index} scope="col">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                style={cellIndex === 2 ? { color: cell < 0 ? 'red' : 'green' } : {}}
                                            >
                                                {cellIndex === 2 && typeof cell === 'number' ? `$${cell.toLocaleString()}` : cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const FullWideCardDashboard = ({ cardTitle, totalDebt, currency, chart, bgcolor, textcolor, description }) => {
    return (
        <div className={`card shadow bg-${bgcolor} text-${textcolor}`} style={{ borderRadius: '20px' }}>
            <div className="card-body row align-items-center">
                {/* Left Section: Text and Total Debt */}
                <div className="col-12 col-md-5 mb-3 mb-md-0">
                    <h5 className="card-title mb-3">{cardTitle}</h5>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                        {currency} {totalDebt.toLocaleString()}
                    </p>
                    <p className={`text-${textcolor === 'light' ? 'light' : 'secondary'}`}>{description}</p>
                </div>

                {/* Right Section: Chart */}
                <div className="col-12 col-md-7">
                    <canvas id={chart} style={{ width: '100%', height: 'auto' }}></canvas>
                </div>
            </div>
        </div>
    );
};

export const CardListDashboard = ({
    textTitle,
    nominal,
    satuan,
    percent,
    color,
    bgcolor,
    textcolor,
    textList,
    bgColorList,
    colorTextList,
    maxHeight = '100px' // Default maxHeight if not provided
}) => {
    const backgroundColor = color === 'green' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

    const listItems = Array.isArray(textList) ? textList : [textList];

    return (
        <div className={`card shadow bg-${bgcolor} text-${textcolor}`} style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <h5 className="card-title" style={{ position: 'relative' }}>
                    <span
                        style={{ fontSize: '0.75em', verticalAlign: 'super' }}
                        className={`text-secondary mr-1 text-${textcolor}`}
                    >
                        {satuan}
                    </span>
                    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>{nominal}</span>
                    <span
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            marginLeft: '5px',
                            fontSize: '0.75em',
                            fontWeight: 'bold',
                            backgroundColor: backgroundColor,
                            color: color,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}
                    >
                        {percent}
                    </span>
                </h5>
                <p className={`text-secondary text-${textcolor}`} style={{ marginTop: '-10px' }}>
                    {textTitle}
                </p>
                <div className="list-group list-group-flush mt-4" style={{ maxHeight, overflowY: 'auto' }}>
                    {listItems.map((item, index) => (
                        <div
                            key={index}
                            className={`list-group-item border-0 p-3 mb-2 bg-${bgColorList} text-${colorTextList}`}
                            style={{ borderRadius: '10px' }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CardProgressDashboard = ({ textTitle, nominal, satuan, percent, color, progress, bgcolor, textcolor, }) => {
    const backgroundColor = color === 'green' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

    return (
        <div className={`card shadow bg-${bgcolor} text-${textcolor} h-100`} style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <h5 className="card-title" style={{ position: 'relative' }}>
                    <span
                        style={{ fontSize: '0.75em', verticalAlign: 'super' }}
                        className={`text-secondary mr-1 text-${textcolor}`}
                    >
                        {satuan}
                    </span>
                    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>{nominal}</span>
                    <span
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            marginLeft: '5px',
                            fontSize: '0.75em',
                            fontWeight: 'bold',
                            backgroundColor: backgroundColor,
                            color: color,
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }}
                    >
                        {percent}
                    </span>
                </h5>
                <p className={`text-secondary text-${textcolor}`} style={{ marginTop: '-10px' }}>
                    {textTitle}
                </p>
                <div style={{ marginTop: '70px' }}>
                    {progress.map((item, index) => (
                        <div
                            key={index}
                            className="progress mb-2"
                            role="progressbar"
                            aria-label={item.label}
                            aria-valuenow={item.value}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <div className={`progress-bar bg-${item.bgColor}`} style={{ width: `${item.value}%` }}>
                                {item.value}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const SmallCardDashboard = ({ textTitle, nominal, satuan, bgcolor, textcolor, description }) => {
    return (
        <div className={`card shadow bg-${bgcolor} text-${textcolor}`} style={{ borderRadius: '20px' }}>
            <div className="card-body">
                <h5 className="card-title">{textTitle}</h5>
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                    {satuan} {nominal.toLocaleString()}
                </p>
                <p className={`text-${textcolor === 'light' ? 'light' : 'secondary'}`}>{description}</p>
            </div>
        </div>
    );
};

export default CardDashboard;

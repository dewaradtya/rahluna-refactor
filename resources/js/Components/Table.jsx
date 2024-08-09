import React from 'react';

const Table = ({ columns, rows, footer, footerColumns }) => {
    return (
        <div className="table-responsive bg-white layered-shadow mt-2">
            <table className="my-table">
                <TableHead columns={columns} />
                <TableBody columns={columns} rows={rows} />
                {footer && footerColumns && <TableFooter columns={columns} footer={footer} footerColumns={footerColumns} />}
            </table>
        </div>
    );
};

const TableHead = ({ columns }) => {
    const groupColumns = columns.filter((column) => column.groupColumn);

    return (
        <thead className="bg-info-subtle">
            <tr>
                {columns.map((column) => (
                    <th key={column.label} colSpan={column.colSpan ?? 1} rowSpan={column.rowSpan ?? 1}>
                        {column.label}
                    </th>
                ))}
            </tr>

            {groupColumns.length > 0 && (
                <tr>
                    {groupColumns.map((column) =>
                        column.groupColumn.map((subColumn) => (
                            <th key={subColumn.label} colSpan={subColumn.colSpan ?? 1} rowSpan={subColumn.rowSpan ?? 1}>
                                {subColumn.label}
                            </th>
                        ))
                    )}
                </tr>
            )}
        </thead>
    );
};

const TableBody = ({ columns, rows }) => {
    return (
        <tbody>
            {rows?.length === 0 && (
                <tr>
                    <td colSpan={columns.length} className="fw-bold fs-6">
                        Data tidak ditemukan.
                    </td>
                </tr>
            )}

            {rows?.map((row, index) => (
                <tr key={index}>
                    {columns.map((column) => {
                        if (column.groupColumn) {
                            return column.groupColumn.map((subColumn) => (
                                <td key={subColumn.name}>{subColumn.renderCell?.(row) ?? row[subColumn.name] ?? '-'}</td>
                            ));
                        } else {
                            return <td key={column.name}>{column.renderCell?.(row) ?? row[column.name] ?? '-'}</td>;
                        }
                    })}
                </tr>
            ))}
        </tbody>
    );
};

const TableFooter = ({ columns, footer, footerColumns }) => {
    const footerRows = footerColumns.map((footerCol) => {
        const column = columns.find((col) => col.name === footerCol.key);
        return { label: footerCol.label, value: footer[footerCol.key] };
    });

    return (
        <tfoot className="bg-warning-subtle fs6 text-center">
            {footerRows.map((footerRow, index) => (
                <tr key={index}>
                    <td className="border border-gray-300 p-2" colSpan={2}>
                        <div className="flex justify-between">
                            <span>{footerRow.label}</span>
                        </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                        <div className="flex justify-between">
                            <span>{footerRow.value}</span>
                        </div>
                    </td>
                </tr>
            ))}
        </tfoot>
    );
};

export default Table;

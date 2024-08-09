import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel
} from '@tanstack/react-table';
import { useEffect, useReducer, useState } from 'react';
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const TableReact = ({ datas, columns }) => {
    const [data, setData] = useState(datas);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100
    });

    useEffect(() => {
        setData(datas);
    }, [datas]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            pagination,
            globalFilter
        }
    });

    return (
        <div className="table-responsive">
            <div className="d-flex justify-content-between">
                <input
                    type="text"
                    className="input-custom layered-shadow"
                    placeholder="Search..."
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    value={globalFilter}
                />

                <select
                    className="input-custom layered-shadow"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 30, 40, 50, 100, 250, 500].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

            <table className="table-custom">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-start align-items-center gap-2">
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <BsChevronDoubleLeft />
                </button>
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <BsChevronLeft />
                </button>
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <BsChevronRight />
                </button>
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <BsChevronDoubleRight />
                </button>
                <span className="d-flex justify-content-start align-items-center gap-1 small">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="d-flex justify-content-start align-items-center gap-1 small">
                    | Go to page:
                    <input
                        type="number"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="input-custom layered-shadow w-25"
                    />
                </span>
            </div>
        </div>
    );
};

export default TableReact;

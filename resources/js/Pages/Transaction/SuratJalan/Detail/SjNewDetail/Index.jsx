import MainLayout from '../../../../../Layouts/MainLayout';
import { useEffect, useMemo, useState } from 'react';
import Table from '../../../../../Components/Table';
import Pagination from '../../../../../Components/Pagination';
import SplitButton from '../../../../../Components/Button/SplitButton';
import { FaFile } from 'react-icons/fa';
import Card from '../../../../../Components/Card';
import { rupiah } from '../../../../../utils';

const Index = ({ invoice, suratJalan, suratJalanNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(200);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDownloadPdf = () => {
        if (invoice && invoice.id) {
            window.open(`/transaksi/invoiceJual/detail/${invoice.id}/pdf`, '_blank');
        }
    };

    const filteredSuratJalan = suratJalan.data.filter(
        (suratJalan) =>
            suratJalan.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            suratJalan.product?.model_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (suratJalan.kategori === 'Paket' && suratJalan.product_package?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const columns = useMemo(
        () => [
            {
                label: 'Produk / Paket',
                name: 'product_package',
                renderCell: (row) => {
                    if (row.kategori === 'Produk') {
                        return row.product?.name || 'N/A';
                    } else if (row.kategori === 'Paket') {
                        return row.product_package?.name || 'N/A';
                    }
                }
            },
            {
                label: 'Qty',
                name: 'qty',
                renderCell: (row) => row.qty
            },
            {
                label: 'Satuan',
                name: 'unit',
                renderCell: (row) => {
                    if (row.kategori === 'Produk') {
                        return row.product?.unit || 'N/A';
                    } else if (row.kategori === 'Paket') {
                        return row.product_package?.unit || 'N/A';
                    }
                }
            },
            {
                label: 'Harga Beli',
                name: 'purchase_price',
                renderCell: (row) => rupiah(row.purchase_price)
            },
            {
                label: 'Harga Jual',
                name: 'price',
                renderCell: (row) => rupiah(row.price)
            },
            {
                label: 'Total Harga',
                name: 'total_sell',
                renderCell: (row) => rupiah(row.price * row.qty)
            },
            {
                label: 'Keterangan',
                name: 'keterangan',
                renderCell: (row) => row.note
            }
        ],
        []
    );

    return (
        <>
            <Card>
                <Card.CardHeader
                    titleText="Table Detail Surat Jalan"
                    additionalInfo={
                        suratJalanNew?.customer
                            ? `${suratJalanNew.customer.name} - ${suratJalanNew.customer.pic} - ${suratJalanNew.customer.telp} - ${suratJalanNew.customer.email}`
                            : 'No customer Selected'
                    }
                />

                <Card.CardBody>
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex column-gap-1 align-items-start flex-wrap">
                            <SplitButton
                                color="dark"
                                text="Print"
                                icon={<FaFile />}
                                onClick={handleDownloadPdf}
                                style={{
                                    position: isSticky ? 'fixed' : 'relative',
                                    top: isSticky ? '50px' : '5px',
                                    right: '0px',
                                    zIndex: 1000,
                                    transition: 'position 0.3s ease, top 0.3s ease'
                                }}
                            />
                        </div>
                    </div>

                    {/* Input pencarian dan dropdown entri per halaman */}
                    <Card.CardFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        entriesPerPage={entriesPerPage}
                        setEntriesPerPage={setEntriesPerPage}
                    />

                    <Table columns={columns} rows={filteredSuratJalan.slice(0, entriesPerPage)} />
                    <Pagination links={suratJalan.links} />
                </Card.CardBody>
            </Card>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Invoice Jual Detail Page" />;

export default Index;

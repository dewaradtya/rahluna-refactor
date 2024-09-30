import CardDashboard from './CardDashboard';
import {
    FaDollarSign,
    FaClipboardList,
    FaChartLine,
    FaCog,
    FaShoppingCart,
    FaReceipt,
    FaExclamationTriangle
} from 'react-icons/fa';
import ChartDashboard from './ChartDashboard';
import MainLayout from '../../Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import { rupiah } from '../../utils';

const Index = ({ chartData }) => {
    const { totalCashflow } = usePage().props;
    const { totalPembelianProdukBulan, totalPembelianProdukTahun } = usePage().props;
    const { totalPenjualanProdukBulan, totalPenjualanProdukTahun } = usePage().props;
    const { totalOperasionalBulan, totalOperasionalTahun } = usePage().props;
    const { totalInvHutang, totalInvHutangOvertime } = usePage().props;
    const { totalInvJualBulan, totalInvJualTahun } = usePage().props;
    const { totalEntertaintCost } = usePage().props;
    const { totalHutang } = usePage().props;

    return (
        <>
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="primary" textTitle="Cash Flow" text={rupiah(totalCashflow)} icon={<FaDollarSign />} />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="info"
                        textTitle="Entertainment Cost"
                        text={rupiah(totalEntertaintCost)}
                        icon={<FaCog />}
                        link="/entertaint"
                    />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="danger"
                        textTitle="Pembelian Produk (Month)"
                        text={rupiah(totalPembelianProdukBulan)}
                        textFooter={`${rupiah(totalPembelianProdukTahun)} (Years)`}
                        icon={<FaShoppingCart />}
                        link="/products/history"
                    />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="success"
                        textTitle="Penjualan Produk (Month)"
                        text={rupiah(totalPenjualanProdukBulan)}
                        textFooter={`${rupiah(totalPenjualanProdukTahun)} (Years)`}
                        icon={<FaChartLine />}
                        link="/products/history"
                    />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="primary"
                        textTitle="Operasional (Month)"
                        text={rupiah(totalOperasionalBulan)}
                        textFooter={`${rupiah(totalOperasionalTahun)} (Years)`}
                        icon={<FaCog />}
                        link="/oprasional"
                    />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="success"
                        textTitle="Penjualan Inv (Month)"
                        text={rupiah(totalInvJualBulan)}
                        textFooter={`${rupiah(totalInvJualTahun)} (Years)`}
                        icon={<FaClipboardList />}
                        link="/transaksi/invoiceJual"
                    />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="danger"
                        textTitle="Hutang Inv Beli"
                        text={rupiah(totalInvHutang)}
                        textFooter={`${rupiah(totalInvHutangOvertime)} (Jatuh Tempo)`}
                        icon={<FaReceipt />}
                        link="/transaksi/invoiceHutang"
                    />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard
                        color="warning"
                        textTitle="Hutang Usaha"
                        text={rupiah(totalHutang)}
                        icon={<FaExclamationTriangle />}
                        link="/hutang"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <ChartDashboard chartData={chartData} />
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Dashboard Page" />;

export default Index;

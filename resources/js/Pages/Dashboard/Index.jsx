import CardDashboard from './CardDashboard';
import { FaCalendar, FaDollarSign, FaClipboardList, FaChartLine, FaCog, FaShoppingCart, FaReceipt, FaExclamationTriangle } from 'react-icons/fa';
import ChartDashboard from './ChartDashboard';
import MainLayout from '../../Layouts/MainLayout';

const Index = () => {
    return (
        <>
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="primary" textTitle="Cash Flow" text="Rp. 2,337,884,470" icon={<FaDollarSign />} />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="info" textTitle="Entertainment Cost" text="$215,000" icon={<FaCog />} />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="danger" textTitle="Pembelian Produk (Month)" text="50%" textFooter="Rp. 2,337,884 (Years)" icon={<FaShoppingCart />} />
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="success" textTitle="Penjualan Produk (Month)" text="18" textFooter="Rp. 2,337,884 (Years)" icon={<FaChartLine />} />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="primary" textTitle="Operasional (Month)" text="18" textFooter="Rp. 2,337,884 (Years)" icon={<FaCog />} />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="success" textTitle="Penjualan Inv (Month)" text="18" textFooter="Rp. 2,337,884 (Years)" icon={<FaClipboardList />} />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="info" textTitle="Hutang Inv Beli" text="18" textFooter="Rp. 2,337,884 (Jatuh Tempo)" icon={<FaReceipt />} />
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardDashboard color="warning" textTitle="Hutang Usaha" text="18" icon={<FaExclamationTriangle />} />
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <ChartDashboard />
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Dashboard Page" />;

export default Index;
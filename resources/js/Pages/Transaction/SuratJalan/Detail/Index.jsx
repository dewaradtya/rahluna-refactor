import React, { useState } from 'react';
import SuratJalanCard from './SuratJalan/Index';
import SuratJalanNewCard from './SuratJalanNew/Index';
import MainLayout from '../../../../Layouts/MainLayout';

const Index = ({ customer, suratJalan, suratJalanNew, products, productPackages }) => {
    const [loadingButton, setLoadingButton] = useState(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SuratJalanCard
                suratJalan={suratJalan}
                products={products}
                customer={customer}
                productPackages={productPackages}
                suratJalanNew={suratJalanNew}
                loadingButton={loadingButton}
                setLoadingButton={setLoadingButton}
            />

            <SuratJalanNewCard
                suratJalanNew={suratJalanNew}
                customer={customer}
                loadingButton={loadingButton}
                setLoadingButton={setLoadingButton}
            />
        </div>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Table Surat Jalan" />;

export default Index;

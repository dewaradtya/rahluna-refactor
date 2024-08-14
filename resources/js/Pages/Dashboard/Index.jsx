import { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import {
    CardDashboard,
    BigCardDashboard,
    CardTableDashboard,
    FullWideCardDashboard,
    CardListDashboard,
    CardProgressDashboard,
    SmallCardDashboard
} from './CardDashboard';
import MainLayout from '../../Layouts/MainLayout';

Chart.register(...registerables);

const Index = () => {
    const columns = ['Date', 'Description', 'Amount'];
    const data = [
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: -100 },
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: 200 },
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: 200 },
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: -100 },
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: 200 },
        { Date: '01-01-2024', Description: 'Example Transaction 1', Amount: -100 },
        { Date: '02-01-2024', Description: 'Example Transaction 2', Amount: 200 }
    ];

    useEffect(() => {
        const charts = [];

        const createCharts = () => {
            // Bar Chart
            new Chart('barChart', {
                type: 'bar',
                data: {
                    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'],
                    datasets: [
                        {
                            label: 'Pajak',
                            data: [200, 100, 200, 100, 90, 300],
                            backgroundColor: 'rgba(178, 0, 184, 0.2)',
                            borderColor: 'rgba(178, 0, 184, 0.8)',
                            borderWidth: 1
                        },
                        {
                            label: 'Non pajak',
                            data: [100, 50, 100, 80, 40, 100],
                            backgroundColor: 'rgba(120, 120, 120, 0.2)',
                            borderColor: 'rgba(120, 120, 120, 0.8)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        x: { display: false, grid: { display: false } },
                        y: { display: false, grid: { display: false } }
                    },
                    layout: {
                        padding: { left: 0, right: 0, top: 10, bottom: 0 }
                    }
                }
            });

            new Chart('barChart1', {
                type: 'bar',
                data: {
                    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'],
                    datasets: [
                        {
                            label: 'Keuntungan',
                            data: [200, 50, 100, 80, 40, 100],
                            backgroundColor: 'rgba(0, 205, 17, 0.2)',
                            borderColor: 'rgba(0, 205, 17, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Kerugian',
                            data: [100, 20, 50, 70, 10, 90],
                            backgroundColor: 'rgba(231, 4, 0, 0.2)',
                            borderColor: 'rgba(231, 4, 0, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            ddisplay: true,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        x: { display: true, grid: { display: false } },
                        y: { display: true, grid: { display: false } }
                    },
                    layout: {
                        padding: { left: 0, right: 0, top: 10, bottom: 0 }
                    }
                }
            });

            // Line chart
            new Chart('lineChart', {
                type: 'line',
                data: {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: 'Keuntungan',
                            data: [9000000, 19000000, 15000000, 18000000],
                            backgroundColor: 'rgba(0, 205, 17, 0.05)',
                            borderColor: 'rgba(0, 205, 17, 1)',
                            borderWidth: 1,
                            fill: true
                        },
                        {
                            label: 'Kerugian',
                            data: [2000000, 9000000, 5000000, 8000000],
                            backgroundColor: 'rgba(255, 99, 132, 0.05)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    layout: {
                        padding: { left: 0, right: 0, top: 10, bottom: 0 }
                    }
                }
            });

            new Chart('lineChart1', {
                type: 'line',
                data: {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: 'Keuntungan',
                            data: [10000, 8000, 9500, 20000],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Kerugian',
                            data: [5000, 5000, 4500, 10000],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    layout: {
                        padding: { left: 0, right: 0, top: 10, bottom: 0 }
                    }
                }
            });

            // radar chart
            new Chart('radarChart', {
                type: 'radar',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'P',
                            data: [6500000, 5900000, 9000000, 8100000, 5600000, 5500000, 400000],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                        },
                        {
                            label: 'NP',
                            data: [4500000, 2900000, 4000000, 5100000, 2600000, 5500000, 200000],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });

            // Polar Chart
            const customerData = [
                { name: 'Januari', count: 10 },
                { name: 'Februari', count: 15 },
                { name: 'Maret', count: 5 },
                { name: 'April', count: 8 },
                { name: 'Mei', count: 12 }
            ];

            new Chart('polarChart', {
                type: 'polarArea',
                data: {
                    labels: customerData.map((c) => c.name),
                    datasets: [
                        {
                            data: customerData.map((c) => c.count),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 10
                            }
                        }
                    },
                    scales: {
                        r: { ticks: { beginAtZero: true } }
                    }
                }
            });
        };

        createCharts();

        return () => {
            charts.forEach((chart) => {
                chart.destroy();
            });
        };
    }, []);
    return (
        <>
            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <div className="row g-4">
                        <div className="col-12">
                            <CardListDashboard
                                textTitle="Cashflow"
                                nominal="600.000"
                                satuan="Rp."
                                percent="5%"
                                bgColorList="primary"
                                textList={['Pemasukan', 'Pengeluaran', 'Pemasukan', 'Pengeluaran', 'Pemasukan', 'Pengeluaran']}
                                colorTextList="light"
                                color="green"
                            />
                        </div>
                        <div className="col-md-6">
                            <CardDashboard
                                textTitle="Pajak"
                                nominal="600.000"
                                satuan="Rp."
                                percent="3%"
                                color="red"
                                chart="barChart"
                            />
                        </div>
                        <div className="col-md-6">
                            <CardProgressDashboard
                                textTitle="Project berjalan"
                                nominal="20.000.000"
                                satuan="Rp."
                                percent="10%"
                                color="green"
                                progress={[
                                    { label: 'Success example', value: 50, bgColor: 'success' },
                                    { label: 'Danger example', value: 25, bgColor: 'danger' }
                                ]}
                                size="20px"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <BigCardDashboard
                        textTitle1="Total overview"
                        description1="Semua Transaksi"
                        description2="Pendapatan Tahunan"
                        nominal="500.000.000"
                        satuan="Rp."
                        percent="7%"
                        color="green"
                        chart="lineChart"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-8 mb-4">
                    <CardTableDashboard
                        textTitle="Hutang Usaha"
                        nominal="50.000.000"
                        satuan="Rp."
                        percent="7%"
                        color="green"
                        columns={columns}
                        data={data}
                    />
                </div>

                <div className="col-md-4 mb-4">
                    <CardDashboard
                        textTitle="Profit Project (Month)"
                        nominal="12.000.000"
                        satuan="Rp."
                        percent="10%"
                        color="green"
                        chart="polarChart"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-12">
                    <FullWideCardDashboard
                        cardTitle="Hutang Project"
                        totalDebt="50.000.000"
                        currency="Rp."
                        chart="radarChart"
                        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati aliquid ipsum est corporis ipsa quibusdam iste, consectetur harum nesciunt debitis."
                        textcolor="primary"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <CardDashboard
                        textTitle="Profit Project (Year)"
                        nominal="120.000.000"
                        satuan="Rp."
                        percent="15%"
                        color="green"
                        chart="lineChart1"
                    />
                </div>

                <div className="col-md-6 mb-4">
                    <CardDashboard
                        textTitle="Piutang"
                        nominal="40.000.000"
                        satuan="Rp."
                        percent="10%"
                        color="green"
                        chart="barChart1"
                    />
                </div>
            </div>
        </>
    );
};

Index.layout = (page) => <MainLayout children={page} title="Dashboard Page" />;

export default Index;

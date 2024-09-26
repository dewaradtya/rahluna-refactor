import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Card from '../../Components/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartDashboard = ({ chartData }) => {
    const chartRef = useRef();

    const data = {
        labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        datasets: [
            {
                label: 'Penjualan',
                data: chartData.penjualan,
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                borderColor: 'rgba(66, 165, 245, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Pengeluaran',
                data: chartData.pengeluaran,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Profit',
                data: chartData.profit,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };

    const handleMouseMove = (event) => {
        const chartCanvas = chartRef.current.canvas;
        if (chartCanvas) {
            chartCanvas.style.cursor = 'crosshair';
        }
    };

    const handleMouseLeave = () => {
        if (chartRef.current.canvas) {
            chartRef.current.canvas.style.cursor = 'default';
        }
    };

    useEffect(() => {
        const canvas = chartRef.current.canvas;

        if (canvas) {
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <Card>
            <Card.CardHeader titleText="Tabel Grafik" />
            <Card.CardBody>
                <div style={{ height: '400px' }}>
                    <Line ref={chartRef} data={data} options={options} />
                </div>
            </Card.CardBody>
        </Card>
    );
};

export default ChartDashboard;

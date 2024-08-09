import React from 'react';
import Card from '../../Components/Card';

const ChartDashboard = () => {
    return (
        <Card>
            <Card.CardHeader titleText="Tabel Grafik">
            </Card.CardHeader>
            <Card.CardBody>
                <div className="chart-area">
                    <canvas id="myAreaChart"></canvas>
                </div>
            </Card.CardBody>
        </Card>
    );
};

export default ChartDashboard;

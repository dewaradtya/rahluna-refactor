import React from 'react';

const CardDashboard = ({ color, textTitle, text, textFooter, icon }) => {
    return (
        <div className={`card border-left-${color} shadow h-100 py-2`}>
            <div className="card-body">
                <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                        <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>{textTitle}</div>
                        <div className="text-sm mb-0 font-weight-bold text-gray-800">{text}</div>
                        <div className={`text-xs mb-0 font-weight-bold text-${color}`}>{textFooter}</div>
                    </div>
                    <div className="col-auto">
                        <i className="fs-2 text-gray-300">{icon}</i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDashboard;
import React from 'react';

export default function Login(){
    return(
        <div className="col-12" style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading...</p>
        </div>
    );
};
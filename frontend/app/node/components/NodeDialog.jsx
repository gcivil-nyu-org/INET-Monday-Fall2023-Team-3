import React, { useState } from 'react';

function NodeDialog({ showDialog, onSubmit, onClose }) {
    const [inputData, setInputData] = useState('');

    const handleSubmit = () => {
        onSubmit(inputData);
        setInputData('');
    };

    return (
        showDialog && (
            <div style={{border: '1px solid black', padding: '10px', marginTop: '20px'}}>
                <textarea 
                    placeholder="Enter node data" 
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)} 
                />
                <br />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        )
    );
}

export default NodeDialog;
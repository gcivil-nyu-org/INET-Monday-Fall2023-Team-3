import React, { useState } from 'react';

function NodeDialog({ showDialog, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        console.log(formData);
        onSubmit(formData);
        setFormData('');
    };

    return (
        showDialog && (
            <div style={{border: '1px solid black', padding: '10px', marginTop: '20px'}}>
                <form onSubmit={handleSubmit}>
                    <label>
                        Course Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                    </label>
                    <label>
                        Description:
                        <input 
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </form>
            </div>
        )
    );
}

export default NodeDialog;
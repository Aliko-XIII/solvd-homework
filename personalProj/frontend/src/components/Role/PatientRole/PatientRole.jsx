import React from 'react';

const PatientRole = ({ roleData, handleInputChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="insuranceNumber">Insurance Number:</label>
                <input
                    type="text"
                    id="insuranceNumber"
                    name="insuranceNumber"
                    value={roleData.insuranceNumber || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="insuranceProvider">Insurance Provider:</label>
                <input
                    type="text"
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={roleData.insuranceProvider || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default PatientRole;

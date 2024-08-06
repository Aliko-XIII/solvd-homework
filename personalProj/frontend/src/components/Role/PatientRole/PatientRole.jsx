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
            <button type="button" onClick={(event) => handleSubmit(event, 'create')}>
                Create Patient
            </button>
            <button type="button" onClick={(event) => handleSubmit(event, 'update')}>
                Update Patient
            </button>
        </form>
    );
};

export default PatientRole;

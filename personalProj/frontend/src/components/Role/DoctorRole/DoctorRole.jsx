import React from 'react';
import SpecializationInput from '../SpecializationInput/SpecializationInput';

const DoctorRole = ({ roleData, handleInputChange, handleSpecializationChange, handleSubmit, data }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="patientLoad">Patient Load:</label>
                <input
                    type="number"
                    id="patientLoad"
                    name="patientLoad"
                    value={roleData.patientLoad || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <SpecializationInput
                getSpecializations={data.getSpecializations}
                value={roleData.specializationId || ''}
                onChange={handleSpecializationChange}
            />
            <div>
                <label htmlFor="workdayStart">Workday Start:</label>
                <input
                    type="time"
                    id="workdayStart"
                    name="workdayStart"
                    value={roleData.workdayStart || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="workdayEnd">Workday End:</label>
                <input
                    type="time"
                    id="workdayEnd"
                    name="workdayEnd"
                    value={roleData.workdayEnd || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default DoctorRole;

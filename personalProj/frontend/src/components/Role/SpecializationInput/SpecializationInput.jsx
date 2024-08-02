import React, { useState, useEffect } from 'react';

const SpecializationInput = ({ getSpecializations, value, onChange }) => {
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchSpecializations = async () => {
            const data = await getSpecializations();
            setSpecializations(data);
        };

        fetchSpecializations();
    }, [getSpecializations]);

    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div>
            <label htmlFor="specialization">Specialization:</label>
            <select id="specialization" value={value} onChange={handleChange}>
                <option value="">Select a specialization</option>
                {specializations.map((specialization) => (
                    <option key={specialization.id} value={specialization.id}>
                        {specialization.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SpecializationInput;

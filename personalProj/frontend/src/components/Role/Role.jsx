import React, { useState, useContext, useEffect } from 'react';
import { HospitalContext } from '../App';
import { useNavigate } from 'react-router-dom';
import SpecializationInput from './SpecializationInput/SpecializationInput';

const Role = ({ setPatient, setDoctor }) => {
    const [selectedRole, setSelectedRole] = useState('patient');
    const [showForm, setShowForm] = useState(false);
    const [roleData, setRoleData] = useState({});
    const { role, user, data } = useContext(HospitalContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (role.name === 'guest') {
            navigate('/login');
        }
    }, [role, navigate]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setShowForm(false);
        setRoleData({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoleData({
            ...roleData,
            [name]: value
        });
    };

    const handleSpecializationChange = (value) => {
        setRoleData({
            ...roleData,
            specializationId: value
        });
    };

    const handleUseRole = async () => {
        if (selectedRole === 'patient') {
            const patientData = await data.getPatient(user.id);
            setPatient(patientData);
        } else if (selectedRole === 'doctor') {
            const doctorData = await data.getDoctor(user.id);
            setDoctor(doctorData);
        }
    };

    const handleCreateRole = () => {
        setShowForm(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedRole === 'patient') {
            data.createPatient(roleData.insuranceNumber, roleData.insuranceProvider, user.id);
            setPatient(roleData);
        } else if (selectedRole === 'doctor') {
            data.createDoctor(roleData.specializationId, roleData.patientLoad, user.id,
                roleData.workdayStart, roleData.workdayEnd);
            setDoctor(roleData);
        }
    };

    const handleDeletePatient = async () => {
        await data.deletePatient(user.id);
        setPatient(null); // Reset patient data after deletion
    };

    const handleDeleteDoctor = async () => {
        await data.deleteDoctor(user.id);
        setDoctor(null); // Reset doctor data after deletion
    };

    return (
        <div>
            <h1>Select Role</h1>
            <div>
                <input
                    type="radio"
                    id="patient"
                    name="role"
                    value="patient"
                    checked={selectedRole === 'patient'}
                    onChange={handleRoleChange}
                />
                <label htmlFor="patient">Patient</label>
                <input
                    type="radio"
                    id="doctor"
                    name="role"
                    value="doctor"
                    checked={selectedRole === 'doctor'}
                    onChange={handleRoleChange}
                />
                <label htmlFor="doctor">Doctor</label>
            </div>
            <button onClick={handleUseRole}>Use role</button>
            <button onClick={handleCreateRole}>Create role</button>
            {selectedRole === 'patient' && (
                <button onClick={handleDeletePatient}>Delete Patient</button>
            )}
            {selectedRole === 'doctor' && (
                <button onClick={handleDeleteDoctor}>Delete Doctor</button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    {selectedRole === 'patient' ? (
                        <>
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
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default Role;

import React, { useState, useContext, useEffect } from 'react';
import { HospitalContext } from '../App';
import { useNavigate } from 'react-router-dom';
import PatientRole from './PatientRole/PatientRole';
import DoctorRole from './DoctorRole/DoctorRole';

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
                selectedRole === 'patient' ? (
                    <PatientRole
                        roleData={roleData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                    />
                ) : (
                    <DoctorRole
                        roleData={roleData}
                        handleInputChange={handleInputChange}
                        handleSpecializationChange={handleSpecializationChange}
                        handleSubmit={handleSubmit}
                        data={data}
                    />
                )
            )}
        </div>
    );
};

export default Role;
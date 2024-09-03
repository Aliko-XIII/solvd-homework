import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HospitalContext } from '../App';
import AppointmentRow from './AppointmentRow/AppointmentRow';

const Appointments = () => {
    const { data, user, role, setRole } = useContext(HospitalContext);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (role.name == 'guest') {
            navigate('/login');
        }
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userId = user.id;
                let response;

                if (role.name === 'patient') {
                    response = await data.getPatientAppointments(userId, true);
                } else if (role.name === 'doctor') {
                    response = await data.getDoctorAppointments(userId, true);
                }

                setAppointments(response);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (role.name) {
            fetchAppointments();
        }
    }, [data, user.id, role]);

    return (
        <div>
            <h2>{role.name === 'patient' ? 'My Appointments' : 'Appointments with Patients'}</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>{role.name === 'patient' ? 'Doctor' : 'Patient'}</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <AppointmentRow key={appointment.id} appointment={appointment} role={role} />
                    ))}
                    {/* <tr>
                        <td>---</td>
                        <td><input name='time' onChange={handleChange} type="text" /></td>
                        <td><input name='duration' onChange={handleChange} type="text" /></td>
                        <td><input name='description' onChange={handleChange} type="text" /></td>
                        <td><select name={role.name === 'patient' ? 'Doctor' : 'Patient'ct></td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    );
};

export default Appointments;

import React, { useContext, useState, useEffect } from 'react';
import { HospitalContext } from '../App';

// function intervalToString(duration) {
//     return `${duration.hours ? duration.hours : '00'}:${duration.minutes ? duration.minutes : '00'}`;
// }

const Appointments = () => {
    const { data, user, role, setRole } = useContext(HospitalContext);
    const [appointments, setAppointments] = useState([]);

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
                        <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.duration}</td>
                            <td>{appointment.description}</td>
                            <td>
                                {role.name === 'patient'
                                    ? `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
                                    : `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Appointments;

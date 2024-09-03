import React, { useContext, useState, useEffect } from 'react';
import { HospitalContext } from '../../App';

const AppointmentRow = ({ appointment, role }) => {
    const { data } = useContext(HospitalContext);
    const [appointmentData, setAppointmentData] = useState({
        time: '',
        duration: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async id => {
        const res = await data.updateAppointment(id, appointmentData);
        console.log(res);
    }
    const handleDelete = async id => {
        const res = await data.deleteAppointment(id);
    }

    return <tr>
        <td>{appointment.id}</td>
        <td><input name='time' onChange={handleChange}
            type="text" defaultValue={appointment.time} /></td>
        <td><input name='duration' onChange={handleChange}
            type="text" defaultValue={appointment.duration} /></td>
        <td><input name='description' onChange={handleChange}
            type="text" defaultValue={appointment.description} /></td>
        <td>
            {role.name === 'patient'
                ? (appointment.doctor ?
                    `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
                    : 'NO DATA')
                : (appointment.patient ?
                    `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`
                    : 'NO DATA')}
        </td>
        <td>
            <button onClick={() => handleUpdate(appointment.id)}>Update</button>
            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
        </td>
    </tr>
}

export default AppointmentRow;
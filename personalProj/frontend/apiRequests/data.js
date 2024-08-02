import { optionalRefresh } from './refresh';

async function getUsers() {
    await optionalRefresh();
    const users = fetch('http://localhost:3000/api/users',
        {
            headers: {
                'Authorization': localStorage.getItem('access_token')
            },
        })
        .then(res => res.json());
    return users;
}

async function updateUser(id, user) {
    await optionalRefresh();
    const users = fetch(`http://localhost:3000/api/users/${id}`,

        {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('access_token'),
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(user),

        })
        .then(res => res.json());
    return users;
}

async function deleteUser(id) {
    await optionalRefresh();
    const deletionStatus = fetch(`http://localhost:3000/api/users/${id}`,

        {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('access_token'),
            },
        })
        .then(res => res.status);
    return deletionStatus;
}

async function getPatient(id) {
    await optionalRefresh();
    const patient = fetch(`http://localhost:3000/api/patients/${id}`,
        {
            headers: {
                'Authorization': localStorage.getItem('access_token')
            },
        })
        .then(res => res.json());
    return patient;
}


async function getDoctor(id) {
    await optionalRefresh();
    const doctor = fetch(`http://localhost:3000/api/doctors/${id}`,
        {
            headers: {
                'Authorization': localStorage.getItem('access_token')
            },
        })
        .then(res => res.json());
    return doctor;
};

async function createPatient(insuranceNumber, insuranceProvider, userId) {
    await optionalRefresh();
    const patientData = {
        insuranceNumber: insuranceNumber,
        insuranceProvider: insuranceProvider,
        userId: userId
    };

    const createdPatient = await fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        body: JSON.stringify(patientData),
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());

    return createdPatient;
}

async function deletePatient(patientId) {
    await optionalRefresh();
    const response = await fetch(`http://localhost:3000/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });

    if (response.status === 204) {
        return 'Patient deleted successfully';
    } else if (response.status === 404) {
        return 'Patient not found';
    } else {
        const error = await response.json();
        return 'Error deleting patient';
    }
}

async function getSpecializations() {
    await optionalRefresh();
    const specializations = fetch('http://localhost:3000/api/specializations',
        {
            headers: {
                'Authorization': localStorage.getItem('access_token')
            },
        })
        .then(res => res.json());
    return specializations;
}

export default {
    getUsers,
    updateUser,
    deleteUser,
    getPatient,
    createPatient,
    deletePatient,
    getDoctor, 
    getSpecializations
};
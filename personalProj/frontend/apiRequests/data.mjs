import { optionalRefresh } from './refresh.mjs';
const API_URL = 'http://localhost:3000/api';

/**
 * Fetch a user by ID.
 * @param {string} id - The ID of the user to fetch.
 * @returns {Promise<Object>} The user data.
 */
const getUserById = async (id) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Fetch all users with optional filters.
 * @param {string} firstName - Filter by first name.
 * @param {string} lastName - Filter by last name.
 * @param {number} minAge - Minimum age filter.
 * @param {number} maxAge - Maximum age filter.
 * @param {string} sex - Filter by sex (F or M).
 * @param {string} phone - Filter by phone number.
 * @returns {Promise<Array>} The list of users.
 */
const getUsers = async ({ firstName, lastName, minAge, maxAge, sex, phone } = {}) => {
    await optionalRefresh();

    const query = new URLSearchParams({
        firstName,
        lastName,
        minAge: minAge ? minAge : undefined,
        maxAge: maxAge ? maxAge : undefined,
        sex,
        phone
    }).toString();

    const response = await fetch(`${API_URL}/users?${query}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Create a new user.
 * @param {Object} userData - The data for the new user.
 * @returns {Promise<Object>} The created user.
 */
const createUser = async (userData) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Update an existing user by ID.
 * @param {string} id - The ID of the user to update.
 * @param {Object} userData - The data to update the user with.
 * @returns {Promise<Object>} The response message.
 */
const updateUser = async (id, userData) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Delete a user by ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
const deleteUser = async (id) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
};


/**
 * Fetch a patient by ID.
 * @param {string} id - The ID of the patient to fetch.
 * @param {boolean} nestUser - Whether to include user data.
 * @returns {Promise<Object>} The patient data.
 */
const getPatientById = async (id, nestUser = false) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/patients/${id}?nestUser=${nestUser}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Fetch all patients with optional filters.
 * @param {Object} filters - The filter parameters.
 * @returns {Promise<Array>} The list of patients.
 */
const getPatients = async ({ insuranceNumber, insuranceProvider, nestUser } = {}) => {
    await optionalRefresh();

    const query = new URLSearchParams({
        insuranceNumber,
        insuranceProvider,
        nestUser: nestUser ? 'true' : undefined,
    }).toString();

    const response = await fetch(`${API_URL}/patients?${query}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Create a new patient.
 * @param {Object} patientData - The data for the new patient.
 * @returns {Promise<Object>} The created patient.
 */
const createPatient = async (patientData) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(patientData),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Update an existing patient by user ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updates - The data to update the patient with.
 * @returns {Promise<Object>} The response message.
 */
const updatePatient = async (userId, updates) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/patients/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Delete a patient by ID.
 * @param {string} id - The ID of the patient to delete.
 * @returns {Promise<void>}
 */
const deletePatient = async (id) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
};

/**
 * Fetch appointments for a patient.
 * @param {string} patientId - The ID of the patient.
 * @returns {Promise<Array>} The list of appointments.
 */
const getPatientAppointments = async (patientId, nestUser = false) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/patients/${patientId}/appointments?nestUser=${nestUser}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};



/**
 * Fetch a doctor by ID.
 * @param {string} id - The ID of the doctor to fetch.
 * @param {boolean} nestUser - Whether to include user data.
 * @param {boolean} nestSpecialization - Whether to include specialization data.
 * @returns {Promise<Object>} The doctor data.
 */
const getDoctorById = async (id, nestUser = false, nestSpecialization = false) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/doctors/${id}?nestUser=${nestUser}&nestSpecialization=${nestSpecialization}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Fetch all doctors with optional nesting for user and specialization data.
 * @param {Object} filters - The filter parameters.
 * @returns {Promise<Array>} The list of doctors.
 */
const getDoctors = async ({ nestUser = false, nestSpecialization = false } = {}) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/doctors?nestUser=${nestUser}&nestSpecialization=${nestSpecialization}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Create a new doctor.
 * @param {Object} doctorData - The data for the new doctor.
 * @returns {Promise<Object>} The created doctor.
 */
const createDoctor = async (doctorData) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(doctorData),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Update an existing doctor by user ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updates - The data to update the doctor with.
 * @returns {Promise<Object>} The response message.
 */
const updateDoctor = async (userId, updates) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/doctors/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token'),
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Delete a doctor by ID.
 * @param {string} id - The ID of the doctor to delete.
 * @returns {Promise<void>}
 */
const deleteDoctor = async (id) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
};

/**
 * Fetch appointments for a doctor.
 * @param {string} doctorId - The ID of the doctor.
 * @returns {Promise<Array>} The list of appointments.
 */
const getDoctorAppointments = async (doctorId, nestUser = false) => {
    await optionalRefresh();

    const response = await fetch(`${API_URL}/doctors/${doctorId}/appointments?nestUser=${nestUser}`, {
        headers: {
            'Authorization': localStorage.getItem('access_token'),
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};

// Fetch all organs with optional filtering
export const getOrgans = async (filters = {}) => {
    await optionalRefresh();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/organs?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch organs');
    }
    return response.json();
};

// Fetch a single organ by ID
export const getOrganById = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/organs/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch organ');
    }
    return response.json();
};

// Create a new organ
export const createOrgan = async (organData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/organs`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organData)
    });
    if (!response.ok) {
        throw new Error('Failed to create organ');
    }
    return response.json();
};

// Update an organ by ID
export const updateOrgan = async (id, organData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/organs/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organData)
    });
    if (!response.ok) {
        throw new Error('Failed to update organ');
    }
    return response.json();
};

// Delete an organ by ID
export const deleteOrgan = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/organs/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete organ');
    }
};

// Fetch all symptoms with optional filtering
export const getSymptoms = async (filters = {}) => {
    await optionalRefresh();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/symptoms?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch symptoms');
    }
    return response.json();
};

// Fetch a single symptom by ID
export const getSymptomById = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/symptoms/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch symptom');
    }
    return response.json();
};

// Create a new symptom
export const createSymptom = async (symptomData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/symptoms`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(symptomData)
    });
    if (!response.ok) {
        throw new Error('Failed to create symptom');
    }
    return response.json();
};

// Update a symptom by ID
export const updateSymptom = async (id, symptomData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/symptoms/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(symptomData)
    });
    if (!response.ok) {
        throw new Error('Failed to update symptom');
    }
    return response.json();
};

// Delete a symptom by ID
export const deleteSymptom = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/symptoms/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete symptom');
    }
};


// Fetch all specializations with optional filtering
export const getSpecializations = async (filters = {}) => {
    await optionalRefresh();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/specializations?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch specializations');
    }
    return response.json();
};

// Fetch a single specialization by ID
export const getSpecializationById = async (id, nestOrgans = false, nestSymptoms = false) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/specializations/${id}?nestOrgans=${nestOrgans}&nestSymptoms=${nestSymptoms}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch specialization');
    }
    return response.json();
};

// Create a new specialization
export const createSpecialization = async (specializationData) => {
    const specialization = {
        name: specializationData.name,
        description: specializationData.description
    };
    specialization.symptoms = specializationData.symptoms.map(id => ({ id: id }));
    specialization.organs = specializationData.organs.map(id => ({ id: id }));
    await optionalRefresh();
    const response = await fetch(`${API_URL}/specializations`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(specialization)
    });
    if (!response.ok) {
        throw new Error('Failed to create specialization');
    }
    return response.json();
};

// Update a specialization by ID
export const updateSpecialization = async (id, specializationData) => {
    await optionalRefresh();
    const specialization = {
        name: specializationData.name,
        description: specializationData.description
    };
    specialization.symptoms = specializationData.symptoms.map(id => ({ id: id }));
    specialization.organs = specializationData.organs.map(id => ({ id: id }));
    const response = await fetch(`${API_URL}/specializations/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(specialization)
    });
    if (!response.ok) {
        throw new Error('Failed to update specialization');
    }
    return response.json();
};

// Delete a specialization by ID
export const deleteSpecialization = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/specializations/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete specialization');
    }
};

// Fetch all appointments with optional filtering
export const getAppointments = async (filters = {}) => {
    await optionalRefresh();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/appointments?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return response.json();
};

// Fetch a single appointment by ID
export const getAppointmentById = async (id, nestDoctor = false, nestPatient = false) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/appointments/${id}?nestDoctor=${nestDoctor}&nestPatient=${nestPatient}`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch appointment');
    }
    return response.json();
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
        throw new Error('Failed to create appointment');
    }
    return response.json();
};

// Update an appointment by ID
export const updateAppointment = async (id, appointmentData) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
        throw new Error('Failed to update appointment');
    }
    return response.json();
};

// Delete an appointment by ID
export const deleteAppointment = async (id) => {
    await optionalRefresh();
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': localStorage.getItem('access_token')
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete appointment');
    }
};


export default {
    getUserById,
    getUsers,
    updateUser,
    deleteUser,

    getPatientById,
    createPatient,
    deletePatient,
    updatePatient,

    getDoctorById,
    updateDoctor,
    createDoctor,
    deleteDoctor,

    getOrgans,
    getOrganById,
    updateOrgan,
    deleteOrgan,
    createOrgan,

    getSymptoms,
    getSymptomById,
    updateSymptom,
    deleteSymptom,
    createSymptom,

    getSpecializations,
    getSpecializationById,
    updateSpecialization,
    deleteSpecialization,
    createSpecialization,

    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments
};
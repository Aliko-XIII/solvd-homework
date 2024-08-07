import React, { useContext, useState, useEffect } from 'react';
import { HospitalContext } from '../App';

const Specializations = () => {
    const { data } = useContext(HospitalContext);
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [organs, setOrgans] = useState([]);
    const [availableSymptoms, setAvailableSymptoms] = useState([]);
    const [availableOrgans, setAvailableOrgans] = useState([]);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await data.getSpecializations();
                setSpecializations(response);
            } catch (error) {
                console.error('Error fetching specializations:', error);
            }
        };

        const fetchSymptoms = async () => {
            try {
                const response = await data.getSymptoms();
                setAvailableSymptoms(response);
            } catch (error) {
                console.error('Error fetching symptoms:', error);
            }
        };

        const fetchOrgans = async () => {
            try {
                const response = await data.getOrgans();
                setAvailableOrgans(response);
            } catch (error) {
                console.error('Error fetching organs:', error);
            }
        };

        fetchSpecializations();
        fetchSymptoms();
        fetchOrgans();
    }, [data]);

    useEffect(() => {
        if (selectedSpecialization) {
            const specialization = specializations.find(spec => spec.id == selectedSpecialization);
            if (specialization) {
                setName(specialization.name);
                setDescription(specialization.description);
                setSymptoms(specialization.symptoms || []);
                setOrgans(specialization.organs || []);
            }
        }
    }, [selectedSpecialization, specializations]);

    const handleCreate = async () => {
        try {
            await data.createSpecialization({ name, description, symptoms, organs });
            const response = await data.getSpecializations();
            setSpecializations(response);
            setName('');
            setDescription('');
            setSymptoms([]);
            setOrgans([]);
        } catch (error) {
            console.error('Error creating specialization:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await data.updateSpecialization(selectedSpecialization, { name, description, symptoms, organs });
            const response = await data.getSpecializations();
            setSpecializations(response);
        } catch (error) {
            console.error('Error updating specialization:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await data.deleteSpecialization(selectedSpecialization);
            const response = await data.getSpecializations();
            setSpecializations(response);
            setSelectedSpecialization('');
            setName('');
            setDescription('');
            setSymptoms([]);
            setOrgans([]);
        } catch (error) {
            console.error('Error deleting specialization:', error);
        }
    };

    const handleAddSymptom = (e) => {
        const selectedSymptom = e.target.value;
        if (selectedSymptom && !symptoms.includes(selectedSymptom)) {
            setSymptoms([...symptoms, selectedSymptom]);
        }
    };

    const handleRemoveLastSymptom = () => {
        setSymptoms(symptoms.slice(0, -1));
    };

    const handleAddOrgan = (e) => {
        const selectedOrgan = e.target.value;
        if (selectedOrgan && !organs.includes(selectedOrgan)) {
            setOrgans([...organs, selectedOrgan]);
        }
    };

    const handleRemoveLastOrgan = () => {
        setOrgans(organs.slice(0, -1));
    };

    return (
        <div>
            <h2>Manage Specializations</h2>
            <div>
                <label>Select Specialization:</label>
                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                    <option value="">Select a specialization</option>
                    {specializations.map(specialization => (
                        <option key={specialization.id} value={specialization.id}>
                            {specialization.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label>Symptoms:</label>
                <input
                    type="text"
                    value={symptoms.join(', ')}
                    readOnly
                />
                <select onChange={handleAddSymptom}>
                    <option value="">Select a symptom</option>
                    {availableSymptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                            {`${symptom.id}-${symptom.name}`}
                        </option>
                    ))}
                </select>
                <button onClick={handleRemoveLastSymptom}>Remove Last Symptom</button>
            </div>
            <div>
                <label>Organs:</label>
                <input
                    type="text"
                    value={organs.join(', ')}
                    readOnly
                />
                <select onChange={handleAddOrgan}>
                    <option value="">Select an organ</option>
                    {availableOrgans.map(organ => (
                        <option key={organ.id} value={organ.id}>
                            {`${organ.id}-${organ.name}`}
                        </option>
                    ))}
                </select>
                <button onClick={handleRemoveLastOrgan}>Remove Last Organ</button>
            </div>
            <button onClick={handleCreate}>Create Specialization</button>
            <button onClick={handleUpdate}>Update Specialization</button>
            <button onClick={handleDelete}>Delete Specialization</button>
        </div>
    );
};

export default Specializations;

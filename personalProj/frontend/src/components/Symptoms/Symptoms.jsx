import React, { useContext, useState, useEffect } from 'react';
import { HospitalContext } from '../App';

const Symptoms = () => {
    const { data } = useContext(HospitalContext);
    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const response = await data.getSymptoms();
                setSymptoms(response);
            } catch (error) {
                console.error('Error fetching symptoms:', error);
            }
        };

        fetchSymptoms();
    }, [data]);

    useEffect(() => {
        if (selectedSymptom) {
            const symptom = symptoms.find(sym => sym.id == selectedSymptom);
            if (symptom) {
                setName(symptom.name);
                setDescription(symptom.description);
            }
        }
    }, [selectedSymptom, symptoms]);

    const handleCreate = async () => {
        try {
            await data.createSymptom({ name, description });
            const response = await data.getSymptoms();
            setSymptoms(response);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating symptom:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await data.updateSymptom(selectedSymptom, { name, description });
            const response = await data.getSymptoms();
            setSymptoms(response);
        } catch (error) {
            console.error('Error updating symptom:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await data.deleteSymptom(selectedSymptom);
            const response = await data.getSymptoms();
            setSymptoms(response);
            setSelectedSymptom('');
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error deleting symptom:', error);
        }
    };

    return (
        <div>
            <h2>Manage Symptoms</h2>
            <div>
                <label>Select Symptom:</label>
                <select
                    value={selectedSymptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                >
                    <option value="">Select a symptom</option>
                    {symptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                            {symptom.name}
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
            <button onClick={handleCreate}>Create Symptom</button>
            <button onClick={handleUpdate}>Update Symptom</button>
            <button onClick={handleDelete}>Delete Symptom</button>
        </div>
    );
};

export default Symptoms;

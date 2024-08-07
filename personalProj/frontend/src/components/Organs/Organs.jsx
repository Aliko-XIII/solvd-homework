import React, { useContext, useState, useEffect } from 'react';
import { HospitalContext } from '../App';

const Organs = () => {
    const { data } = useContext(HospitalContext);
    const [organs, setOrgans] = useState([]);
    const [selectedOrgan, setSelectedOrgan] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchOrgans = async () => {
            try {
                const response = await data.getOrgans();
                setOrgans(response);
            } catch (error) {
                console.error('Error fetching organs:', error);
            }
        };

        fetchOrgans();
    }, [data]);

    useEffect(() => {
        if (selectedOrgan) {
            const organ = organs.find(org => org.id == selectedOrgan);
            if (organ) {
                setName(organ.name);
                setDescription(organ.description);
            }
        }
    }, [selectedOrgan, organs]);

    const handleCreate = async () => {
        try {
            await data.createOrgan({ name, description });
            const response = await data.getOrgans();
            setOrgans(response);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating organ:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await data.updateOrgan(selectedOrgan, { name, description });
            const response = await data.getOrgans();
            setOrgans(response);
        } catch (error) {
            console.error('Error updating organ:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await data.deleteOrgan(selectedOrgan);
            const response = await data.getOrgans();
            setOrgans(response);
            setSelectedOrgan('');
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error deleting organ:', error);
        }
    };

    return (
        <div>
            <h2>Manage Organs</h2>
            <div>
                <label>Select Organ:</label>
                <select
                    value={selectedOrgan}
                    onChange={(e) => setSelectedOrgan(e.target.value)}
                >
                    <option value="">Select an organ</option>
                    {organs.map(organ => (
                        <option key={organ.id} value={organ.id}>
                            {organ.name}
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
            <button onClick={handleCreate}>Create Organ</button>
            <button onClick={handleUpdate}>Update Organ</button>
            <button onClick={handleDelete}>Delete Organ</button>
        </div>
    );
};

export default Organs;

import React, { useContext, useState } from 'react';
import { HospitalContext } from '../App';

const Config = ({ updateUser }) => {
    const { user, setUser } = useContext(HospitalContext);
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(user.id, formData);
        setUser(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Phone:
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Age:
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Sex:
                <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                >
                    <option value="M">M</option>
                    <option value="F">F</option>
                </select>
            </label>
            <br />
            <button type="submit">Update</button>
        </form>
    );
};

export default Config;

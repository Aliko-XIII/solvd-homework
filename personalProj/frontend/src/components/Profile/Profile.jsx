import React, { useContext } from 'react';
import { HospitalContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Profile = ({ deleteUser }) => {
    const { user, setUser } = useContext(HospitalContext);
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        try {
            await deleteUser(user.id);
            navigate('/login');
            setUser({});
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    if (!user || !user.firstName) {
        return <p>No user logged in</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Phone: {user.phone}</p>
            <p>Age: {user.age}</p>
            <p>Sex: {user.sex}</p>
            <button onClick={handleDelete}>Delete User</button>
        </div>
    );
};

export default Profile;

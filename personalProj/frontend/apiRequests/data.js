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

export default {
    getUsers,
    updateUser,
    deleteUser
};
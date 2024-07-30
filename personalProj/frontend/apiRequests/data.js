import { optionalRefresh } from './refresh';

async function getUsers() {
    optionalRefresh();
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
    optionalRefresh();
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

export default {
    getUsers,
    updateUser
};
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

export default {
    getUsers
};
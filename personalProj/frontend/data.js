async function getUsers() {
    const users = fetch('http://localhost:3000/api/users/all')
        .then(res => res.json());
    return users;
}

export default {
    getUsers: getUsers,
};
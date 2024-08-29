
async function registerUser(firstName, lastName, phone, password, age, sex) {
    const user = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        password: password,
        age: age,
        sex: sex,
    }
    const registeredUser = await fetch('http://localhost:3000/api/authorization/register', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json());
    return registeredUser;
}



export default {
    registerUser,
};

const linksConfig = {
    guest: [
        { title: 'Login', link: '/login' },
        { title: 'Register', link: '/register' }
    ],
    user: [
        { title: 'Role', link: '/role' },
        { title: 'Config', link: '/config' },
        { title: 'Profile', link: '/profile' }
    ],
    patient: [
        { title: 'Doctors', link: '/doctors' },
        { title: 'Appointments', link: '/appointments' },
    ],
    doctor: [
        { title: 'Symptoms', link: '/symptoms' },
        { title: 'Organs', link: '/organs' },
        { title: 'Specializations', link: '/specializations' },
        { title: 'Patients', link: '/patients' },
        { title: 'Appointments', link: '/appointments' },
    ]
};

const getUserLinks = (role) => {
    return linksConfig[role] || linksConfig.guest;
}

export default getUserLinks;
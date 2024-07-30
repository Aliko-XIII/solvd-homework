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
        { title: 'Insurance', link: '/insurance' },
        { title: 'Appointments', link: '/appointments' },
    ],
    doctor: [
        { title: 'Specialization', link: '/specialization' },
        { title: 'Patients', link: '/patients' },
        { title: 'Appointments', link: '/appointments' },
    ]
};

const getUserLinks = (role) => {
    return linksConfig[role] || linksConfig.guest;
}

export default getUserLinks;
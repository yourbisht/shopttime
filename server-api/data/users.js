import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Mukesh Bisht',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Sari Bisht',
        email: 'sari@gmail.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Dharuv Bisht',
        email: 'bisht@gmail.com',
        password: bcrypt.hashSync('123456', 10),

    }
]

export default users
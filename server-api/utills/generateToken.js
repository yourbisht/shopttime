import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JSONTOKEN_SECRET,{
        expiresIn: '7d'
    })
}

export default generateToken
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async(req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JSONTOKEN_SECRET)

            req.user = await User.findById(decode.id).select('-password')

            next()
        } catch (error) {
            res.status(401)
            throw new Error(' Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

const isAdmin = asyncHandler(async(req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error('Required admin authentication for access this resource')
    }
})

export { protect, isAdmin }
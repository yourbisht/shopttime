import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utills/generateToken.js'

//@desc     Auth user & get token
//@url      /api/users/login

const authUser = asyncHandler (async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//@desc     Register A New User
//@url      /api/users/register

const registerUser = asyncHandler (async(req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    
    const user = await User.create({
        name,
        email,
        password
    })
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc     Get User Info
//@url      /api/users/profile
const getUserProfile = asyncHandler (async(req, res) => {
    //res.send('success')
    //console.log(req.user._id);return false;
    const user = await User.findById(req.user._id)
    
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//@desc     Update User Profile
//@url      /api/users/profile
const updateUserProfile = asyncHandler (async(req, res) => {
    const user = await User.findById(req.user._id)
    
    if(user){
        user.name = req.body.name || user.name
        if(req.body.password){
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//@desc     Get All Users List
//@url      /api/users
const getUsersList = asyncHandler (async(req, res) => {
    const users = await User.find({})
    
    if(users){
        res.json(users)
    }else{
        res.status(404)
        throw new Error('Users not found')
    }
})

//@desc     Delete User
//@url      /api/users/:id
const deleteUser = asyncHandler (async(req, res) => {
    const user = await User.findById(req.params.id)
    
    if(user){
        await user.remove()
        res.json({ message: 'User deleted successfully'})
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//@desc     Get User By ID
//@url      /api/users/profile
const getUserById = asyncHandler (async(req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    
    if(user){
        res.json(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//@desc     Update User
//@url      /api/users/:id
const updateUser = asyncHandler (async(req, res) => {

    const user = await User.findById(req.params.id)
    if(user){
        user.name = req.body.name //|| user.name
        user.email = req.body.email //|| user.email
        user.isAdmin = req.body.isAdmin //|| user.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsersList, deleteUser, getUserById, updateUser }
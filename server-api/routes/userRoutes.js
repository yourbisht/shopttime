import express from 'express'
const router = express.Router();
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsersList, deleteUser, getUserById, updateUser } from '../controllers/userController.js'
import { protect, isAdmin } from '../middleware/authMiddleware.js'

router.route('/').get(protect, isAdmin, getUsersList);
router.route('/login').post(authUser);
router.route('/register').post(registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id')
    .delete(protect, isAdmin, deleteUser)
    .get(protect, isAdmin, getUserById)
    .put(protect, isAdmin, updateUser)



export default  router
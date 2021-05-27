import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'

import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'

import connectDB from './config/db.js'

dotenv.config({path: 'config/config.env'})
connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        //console.log(users);process.exit()
        const CreatedUser = await User.insertMany(users)
        
        const adminUser = CreatedUser[0]._id
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser }
        })
        await Product.insertMany(sampleProducts)
        console.log('Data Imported Sucessfully !!!');
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

const destryData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed Sucessfully !!!');
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

if(process.argv[2] === 'd'){
    destryData()
}else{
    importData()
}
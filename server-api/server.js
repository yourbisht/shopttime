import express from 'express';
import path from 'path'
//import products from './data/products.js';
import connectDB from './config/db.js'
import dotenv from 'dotenv';
import morgan from 'morgan'
import productRoutes from './routes/productsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config({path: 'config/config.env'})

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/client/public/images', express.static(path.join(__dirname, '/client/public/images')))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/build')))
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    )
}else{
    app.get('/', (req, res) => {
        res.send('API is Running')
    })
}


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 7000;
app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on PORT ${PORT} ...`))
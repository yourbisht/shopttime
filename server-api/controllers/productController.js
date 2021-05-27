import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import { updateUser } from './userController.js'

//@desc   Fetch All Products
const getProducts = asyncHandler (async(req, res) => {
    const pageSize = 4
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page -1))

    res.json({products, page, pages: Math.ceil(count / pageSize) })
})

//@desc   Fetch Product By ID
const getProductById = asyncHandler (async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Delete Product
//@url      /api/products/:id
const deleteProduct = asyncHandler (async(req, res) => {
    const product = await Product.findById(req.params.id)
    
    if(product){
        await product.remove()
        res.json({ message: 'Product deleted successfully'})
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Create Product
//@url      /api/products/create
const createProduct = asyncHandler (async(req, res) => {
    const { name, price, description, image, brand, category, countInStock, numReviews } = req.body
    //console.log(req);
    //console.log(' USer ID '+req.user._id);
    const product = new Product ({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        numReviews,
        description,
        description,
        numReviews
    })
    //console.log(product);
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//@desc     Update Product
//@url      /api/products/:id
const updateProduct = asyncHandler (async(req, res) => {

    const { name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        product.name = name || product.name
        product.price = price || product.price
        product.description = description | product.description
        product.image = image || product.image
        product.brand = brand || product.brand
        product.category = category || product.category
        product.countInStock = countInStock || product.countInStock

        const updatedUser = await product.save()

        res.json(updateProduct)
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Add Product Review
//@url      /api/products/:id/reviews
const createProductReview = asyncHandler (async(req, res) => {

    const { 
        rating, comment
     } = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.status(400)
            throw new Error(' Product already reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        
        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/ product.reviews.length

        await product.save()

        res.status(201).json({
            message: 'Review added'
        })
    }else{
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Get Top Rated products]
//@url      /api/products/top
const getTopProducts = asyncHandler (async(req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }
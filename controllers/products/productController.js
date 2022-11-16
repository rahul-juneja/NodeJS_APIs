import Joi from "joi"
import errorHandler from "../../middlewares/errorHandlers"
import {
    Product
} from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import JwtService from "../../services/JwtService"

const productController = {
    async addproducts(req, res, next) {
        const addProductSchema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required(),
            second_image: Joi.string().required(),
            price: Joi.number().required(),
            discount_price: Joi.number().required(),
            discount_percentage: Joi.number().required(),
            category: Joi.string().required(),
        })

        const { error } = addProductSchema.validate(req.body)

        if (error) {
            next(error)
        }

        const {
            name,
            description,
            image,
            second_image,
            price,
            discount_price,
            discount_percentage,
            category
        } = req.body
        const product = new Product({
            name,
            description,
            image,
            second_image,
            price,
            discount_price,
            discount_percentage,
            category,
        })


        let access_token
        try {
            const result = await product.save()
            access_token = JwtService.sign({
                _id: result._id,
                name: result.name
            })

        } catch (error) {
            return next(error)
        }
        res.json({
            access_token
        })

    },
    async delproducts(req, res, next) {

    },
    async showproducts(req, res, next) {
        let products
        try{
            if(!req.params.category){
                products = await Product.find()
            }else{
                // Checking if the category entered exists in the DB or not.
                const exist = await Product.exists({category: req.params.category})
                if(!exist){
                    return next(CustomErrorHandler.notFound("Products not found."))
                }
                products = await Product.find({category: req.params.category})
            }
            
        }catch(err){
            return next(new Error("Something wrong with the database."))
        }
        const { category } = products
        res.json({
            products
        })
    }
}



export default productController
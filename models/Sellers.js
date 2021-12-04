const mongoose=require("mongoose")
const Joi=require("joi")

const SellerSchema=new mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type:Number
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Item'
            },
            productName:{
                type:String
            },
            productPrice:{
                type:Number
            },
            productImage:{
                type:String
            },
            soldOrRented:{
                type:String
            }
        }
    ]
})

function validateSeller(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        email: Joi.string().email().min(6).max(100).required(),
        phone: Joi.string().length(10).allow(""),
        password: Joi.string().min(1).max(1000).required()
    });

    return schema.validate(user);
}

function validateSellerLogin(seller){
    const schema=Joi.object({
        email:Joi.string().required().min(3).max(100),
        password:Joi.string().required().min(6).max(100)
    })

    return schema.validate(seller)
}

module.exports.validateSeller=validateSeller
module.exports.validateSellerLogin=validateSellerLogin
module.exports=mongoose.model('Sellers',SellerSchema)
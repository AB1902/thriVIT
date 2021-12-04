const mongoose=require("mongoose")
const Joi=require("joi")

const ItemSchema=new mongoose.Schema({
    productName:{
        type:String
    },
    productPrice:{
        type:Number
    },
    productImage:{
        type:String
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sellers'
    },
    postedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Buyers'
    },
    sellerName:{
        type:String,
        ref:'Sellers'
    }
})

function validateItem(item) {
    const schema = Joi.object({
        productName: Joi.string().min(1).max(100).required(),
        productPrice: Joi.number().required(),
        productImage:Joi.string().required(),
        sellerName:Joi.string().required()
    });

    return schema.validate(item);
}


module.exports.validateItem=validateItem
module.exports=mongoose.model('Item',ItemSchema)
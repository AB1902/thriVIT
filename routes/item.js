const express=require("express")
const router=express.Router()
const Item=require("../models/Item")
const validateItem=require("../models/Item")
const Sellers=require("../models/Sellers")
const Buyers=require("../models/Buyers")
const config=require("config")
const Razorpay=require('razorpay')
const jwt=require("jsonwebtoken")
const shortid=require('shortid')

var razorpay = new Razorpay({
    key_id: 'rzp_test_5RT28hHJ8jD677',
    key_secret: '2hmUdxwluUs9Gm5Qb948zSKI',
  });

router.get("/",function(req,res){
    res.redirect("/items")
})

router.get("/items",async (req,res)=>{

    try {
        const allItems=await Item.find()
        res.json(allItems)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get("/items/:id",async (req,res)=>{
    try {
        const item=await Item.findById(req.params.id)
        if(!item){
            res.status(400).json({message:"item not found"})
        }
        res.status(200).json(item)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post("/items/pay",async(req,res) => {
    const payment_capture=1
    const receipt=shortid.generate()
    const amount=100000
    const currency="INR"
    const options={amount,currency,receipt,payment_capture}
    try {
        const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
    } catch (error) {
        console.log(error.message)
    }
    
    console.log(response)
})

router.post("/items/post",async (req,res)=>{
    const {errors}=validateItem(req.body)
    if(errors){
        res.status(460).json(errors)
    }

    const token=req.headers['x-auth-token']
    const payload=jwt.verify(token,config.get("JWTSecret"),{ignoreExpiration:true})

    const sellerId=payload.seller.id
    const seller=await Sellers.findById(sellerId)

    
    const{productName,productPrice,productImage,sellerName}=req.body
    const postedBy=sellerId
    try {
        const item=new Item({
            productName,productPrice,postedBy,productImage,sellerName
        })
        
        await item.save()
        const itemId=item._id

        const sellerItem={
            itemId,productName,productPrice,productImage
        }
        seller.products.unshift(sellerItem)
        await seller.save()

        res.json({item,seller})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.delete("/items/:id",async(req,res)=>{
    try {
        const item=await Item.findById(req.params.id)
        if(!item){
            res.status(400).json({message:"item not found"})
        }
        await item.delete()
        res.status(200).json({message:"item deleted"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports=router
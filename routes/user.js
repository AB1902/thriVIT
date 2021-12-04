const express=require("express")
const router=express.Router()
const validateBuyer=require("../models/Buyers")
const validateSellerLogin=require("../models/Sellers")
const validateBuyerLogin=require("../models/Buyers")
const validateSeller=require("../models/Sellers")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const Buyers=require("../models/Buyers")
const Sellers=require("../models/Sellers")
const config=require("config")


router.post("/buyer/register",async (req,res) =>{

    const {errors}=validateBuyer(req.body)
    if(errors){
        return res.status(460).json({errors})
    }
    const {name,email,phone,password}=req.body

    try {
        var buyer=await Buyers.findOne({email})
        
        if(buyer){
            res.status(461).json({error:"user already exists"})
        }

        var buyer=new Buyers({
            name,email,phone,password
        })

        //gensalt ecryption
        const salt=await bcrypt.genSalt(10)
        buyer.password=await bcrypt.hash(password,salt)
        buyer.save()

        //JWT
        const payload={
            buyer:{
                id:buyer._id
            }
        }

        jwt.sign(payload,config.get("JWTSecret"),{expiresIn:3934809530},function(error,token){
            if(error) throw error
            res.json({login:"succesful",token,firstLogin:true})
        })
        console.log(req.body)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post("/seller/register",async (req,res) =>{
    const {errors}=validateSeller(req.body)
    if(errors){
        return res.status(460).json({errors})
    }
    const {name,email,phone,password}=req.body

    try {
        var seller=await Sellers.findOne({email})
        
        if(seller){
            res.status(461).json({error:"seller already exists"})
        }

        var seller=new Sellers({
            name,email,phone,password
        })

        //gensalt ecryption
        const salt=await bcrypt.genSalt(10)
        seller.password=await bcrypt.hash(password,salt)
        seller.save()

        //JWT
        const payload={
            seller:{
                id:seller._id
            }
        }

        jwt.sign(payload,config.get("JWTSecret"),{expiresIn:3934809530},function(error,token){
            if(error) throw error
            res.json({login:"succesful",token,firstLogin:true})
        })
        console.log(req.body)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post("/buyer/login",async (req,res) =>{
    const {errors}=validateBuyerLogin(req.body)
    if(errors){
        return res.status(460).json({errors})
    }

    const {email,password}=req.body

    try {
        var buyer=await Buyers.findOne({email})

        if(!buyer){
            res.status(461).json({message:"buyer not found"})
        }

        const isMatch=await bcrypt.compare(password,buyer.password)

        if(!isMatch){
            res.status(400).json({message:"incorrect password"})
        }

        //returning jwt
        const payload={
            buyer:{
                id:buyer._id
            }
        }

        jwt.sign(payload,config.get("JWTSecret"),{expiresIn:360000},function(err,token){
            if (err) throw err
            res.json({"logged in":true,token})
        })

        console.log(req.body)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post("/seller/login",async (req,res) =>{
    const {errors}=validateSellerLogin(req.body)
    if(errors){
        return res.status(460).json({errors})
    }

    const {email,password}=req.body

    try {
        var seller=await Sellers.findOne({email})

        if(!seller){
            res.status(461).json({message:"seller not found"})
        }

        const isMatch=await bcrypt.compare(password,seller.password)

        if(!isMatch){
            res.status(400).json({message:"incorrect password"})
        }

        //returning jwt
        const payload={
            seller:{
                id:seller._id
            }
        }

        jwt.sign(payload,config.get("JWTSecret"),{expiresIn:360000},function(err,token){
            if (err) throw err
            res.json({"logged in":true,token})
        })

        console.log(req.body)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports=router
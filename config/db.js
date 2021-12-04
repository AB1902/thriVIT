const mongoose=require("mongoose")
const config=require("config")
const DB=config.get("mongoURI")

const connectDB=async () => {
    try {
        await mongoose.connect(DB,{})
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports=connectDB
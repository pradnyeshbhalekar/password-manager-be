const CryptoJS = require("crypto-js")
const Password = require('../models/passwordModel');
require("dotenv").config()
const {v4:uuidv4} = require('uuid');


const SECRET_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"


const storePassword = async (req, res) => {
    try {
        const { serviceName, password } = req.body;
        const userId = req.user.userId;

        if (!serviceName || !password) {
            return res.status(400).json({ error: "Service name and password are required" });
        }

        const serviceId = uuidv4(); 
        
        const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

        const newPassword = new Password({ userId, serviceName, serviceId, encryptedPassword });
        await newPassword.save();

        res.status(201).json({ message: "Password stored successfully", serviceId });
    } catch (err) {
        console.error("Error storing password:", err);
        res.status(500).json({ error: "Error occurred while storing password" });
    }
};

const getDecryptedPassword = async (req, res) => {
    console.log("api hit: getDecryptedPassword"); 
    try {
        const userId = req.user.userId;
        const { serviceId } = req.params;

        const passwordEntry = await Password.findOne({ userId, serviceId });

        if (!passwordEntry) {
            console.log("No password entry found");
            return res.status(404).json({ error: "Service not found" });
        }

        const decryptedBytes = CryptoJS.AES.decrypt(passwordEntry.encryptedPassword, SECRET_KEY);
        const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedPassword) {
            console.log("Decryption failed");
            return res.status(500).json({ error: "Error decrypting password" });
        }


        res.status(200).json({ 
            serviceId: passwordEntry.serviceId,  
            serviceName: passwordEntry.serviceName, 
            decryptedPassword 
        });
    } catch (err) {
        console.error("Error fetching password: ", err);
        res.status(500).json({ error: "Server error" });
    }
};

const getAllPassword = async (req,res) => {
    try{
        const userId = req.user.userId;
        const password = await Password.find({userId});

        res.status(200).json(password);
    }catch(error){
        console.error("error fetching password: ",error)
        res.status(500).json({error: "internal error"})
    }
}

const updatePassword = async (req,res) => {
    try{
        const userId = req.user.userId;
        const {password} = req.body;
        const {serviceId} = req.params;

        if(!password) return res.status(400).json({error:"new password required"})

            const encryptedPassword = CryptoJS.AES.encrypt(password,SECRET_KEY).toString();

            const updatedPassword = await Password.findOneAndUpdate(
                {userId,serviceId},
                {encryptedPassword},
                {new: true}
            )
            if(!updatedPassword) return res.status(404).json({error:"service not found"})
            
            res.status(200).json({message:"Updated password successfully"});
    }catch(err){
        console.error("err occured:",err)
        res.status(500).json({ err: " Server Error" });

    }
}

const deletePassword = async(req,res) => {
    try{
        const userId = req.user.userId;
        const {serviceId} = req.params;

        const deletePassword = await Password.findOneAndDelete({userId,serviceId})

        if(!deletePassword) return res.status(404).json({error:"service not found"});

        res.status(200).json({message: `Password deleted for ${serviceId}` })


    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}




module.exports ={storePassword,getDecryptedPassword,getAllPassword,updatePassword,deletePassword}
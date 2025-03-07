const express = require('express')
const {storePassword,getDecryptedPassword,getAllPassword,updatePassword,deletePassword} = require('../controller/passwordController')
const {authMiddleware} = require('../middleware/authMiddleware')

const router =express.Router();

router.post("/",authMiddleware,storePassword)
router.get('/',authMiddleware,getAllPassword)
router.get('/:serviceId',authMiddleware,getDecryptedPassword)
router.put('/update/:serviceId',authMiddleware,updatePassword);
router.delete('/delete/:serviceId',authMiddleware,deletePassword);
module.exports = router

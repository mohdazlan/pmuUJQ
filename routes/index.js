const express = require('express');
const router = express.Router()
const Document = require('../models/document')

router.get('/', async (req,res)=>{
   let documents = []
    try {
        documents = await Document.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch (error) {
        console.log(error);
        documents = []
    }
    res.render('index', {documents})
})

module.exports = router
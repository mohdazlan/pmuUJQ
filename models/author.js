const mongoose = require('mongoose')
const Document = require('../models/document')

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

authorSchema.pre('remove',function(next) {
 Document.find({author:this.id}, (err,document) => {
     if(err){
         next(err)
     } else if(document.length > 0){
         next(new Error('This author has books still '))
     } else {
         next()
     }
 })
})

module.exports = mongoose.model('Author',authorSchema)
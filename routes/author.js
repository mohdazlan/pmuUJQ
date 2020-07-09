const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//All Author Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name,'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors ,
            searchOptions:req.query
        })
    } catch (error) {
        res.redirect('/')
    }
})

//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author Route without Async/Await
// router.post('/',(req,res) =>{
//     const author =new Author({
//         name: req.body.name
//     })
//     author.save((err, newAuthor) =>{
//         if(err){
//             res.render('authors/new', {
//                 author, 
//                 errorMessage: 'Error Creating Author'
//             }) 
//         }else {
//               res.redirect('authors')  
//         }
//     })
//     //res.send(req.body.name)
// })

//Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect('authors')
    } catch (error) {
        res.render('authors/new', {
            author,
            errorMessage: 'Error Creating Author'
        })
    }
})
module.exports = router
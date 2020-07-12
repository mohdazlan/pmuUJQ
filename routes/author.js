const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Document = require('../models/document')

//All Author Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors,
            searchOptions: req.query
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
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new', {
            author,
            errorMessage: 'Error Creating Author'
        }) 
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const documents = await Document.find({author:author.id}).limit(6).exec()
        res.render('authors/show', {
            author,
            booksByAuthor: documents
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author})
    } catch (error) {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
 let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
       await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        if(author == null){
            res.redirect('/')
        } else {
            res.render('authors/new', {
                author,
                errorMessage: 'Error updating Author'
            })
        }
       
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id) 
       await author.remove() 
       res.redirect('/authors')
    } catch (error) {
        if(author == null){
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
       
    }
})

module.exports = router
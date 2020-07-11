const express = require('express')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const router = express.Router()

const Document = require('../models/document')
const Author = require('../models/author')

const uploadPath = path.join('public', Document.coverImageBasePath)
const uploadDocPath = path.join('public', Document.fileBasePath)

const imageMimeTypes = ['image/jpeg', 'image/png'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//All Documents Route
router.get('/', async (req, res) => {
    const query = Document.find()
    // if(req.query.title !=null && req.query.title != ''){
    //     query = query.regex('title',new RegExp(req.query.title, 'i'))
    // }
    try {
        const documents = await Document.find({})
        res.render('documents/index', {
            documents,
            searchOptions: req.query
        })
    } catch (error) {
       res.redirect('/') 
    }
})

//New Document Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Document())
})

//Create Document Route
router.post('/', upload.single('cover'), async (req, res)=> {
    
  const fileName = req.file != null ? req.file.filename : null;
    
    const document = new Document({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newDoc = await document.save()
        res.redirect('documents')
    } catch (error) {
        if(document.coverImageName != null) {
            removeDocumentCover(document.coverImageName)
        }
        renderNewPage(res, document, true)
    }
})

function removeDocumentOver(fileName){
 fs.unlink(path.join(uploadImagePath, fileName), err => {
     if(err) console.error(err)
 })
}

async function renderNewPage(res, document, hasError = false) {
    try {
        const authors = await Author.find({})
        const document = new Document()
        const params = {
            authors: authors,
            document: document
        }
        if (hasError) params.errorMessage = 'Error Creating Document'
        res.render('documents/new', params)
    } catch (error) {
        res.redirect('/documents')
    }
}

module.exports = router
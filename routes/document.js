const express = require('express')
const router = express.Router()
const Document = require('../models/document')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

//All Documents Route
router.get('/', async (req, res) => {
    let query = Document.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishedDate', publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.lte('publishedDate', publishedAfter);
    }
    try {
        const documents = await query.exec()
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
router.post('/', async (req, res) => {
    //   const fileName = req.file != null ? req.file.filename : null;
    const document = new Document({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    console.log(req.body.cover)
    saveCover(document, req.body.cover)

    try {
        const newDoc = await document.save()
        res.redirect('documents')
    } catch (error) {
        // if(document.coverImageName != null) {
        //     removeDocumentCover(document.coverImageName)
        // // }
        // console.log(error)
        renderNewPage(res, document, true)
    }
})

// function removeDocumentOver(fileName){
//  fs.unlink(path.join(uploadImagePath, fileName), err => {
//      if(err) console.error(err)
//  })
// }

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

function saveCover(document, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      document.coverImage = new Buffer.from(cover.data, 'base64')
      document.coverImageType = cover.type
    }
}

module.exports = router
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
        res.redirect(`documents/${newDoc.id}`)
    } catch (error) {
        // if(document.coverImageName != null) {
        //     removeDocumentCover(document.coverImageName)
        // // }
        // console.log(error)
        console.log(error)
        renderNewPage(res, document, true)
    }
})

// function removeDocumentOver(fileName){
//  fs.unlink(path.join(uploadImagePath, fileName), err => {
//      if(err) console.error(err)
//  })
// }
// Show Document Route
router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('author')
            .exec()
        res.render('documents/show', { document })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Edit Document Route
router.get('/:id/edit', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        console.log(req.params)
        renderEditPage(res, document)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//Update Document Route
router.put('/:id', async (req, res) => {
    let document

    try {
        document = await Document.findById(req.params.id)
        document.title = req.body.title
        document.author = req.body.author
        document.publishDate = new Date(req.body.publishDate)
        document.pageCount = req.body.pageCount
        document.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(document, req.body.cover)
        }
        await document.save()
        res.redirect(`/documents/${document.id}`)
    } catch (error) {
        console.log(error)
        if (document != null) {
            renderEditPage(res, document, true)
        } else {
            console.log(error)
            // res.redirect('/') 
        }

    }
})

router.delete('/:id', async (req, res) => {
    let document
    try {
        document = await Document.findById(req.params.id)
        await document.remove()
        res.redirect('/documents')
    } catch (error) {
        if (document != null) {
            res.render('documents/show', {
                document,
                errorMessage: 'Could not remove document'
            })
        } else {
            res.redirect('/')
        }
    }
})
async function renderNewPage(res, document, hasError = false) {
    renderFormPage(res, document, 'new', hasError)
}

async function renderEditPage(res, document, hasError = false) {
    renderFormPage(res, document, 'edit', hasError)
}

async function renderFormPage(res, document, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            document: document
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Document'
            } else {
                params.errorMessage = 'Error Creating Document'
            }
        }
        console.log('from renderFormPage func ' + params)
        res.render(`documents/${form}`, params)
    } catch (error) {
        console.log(error)
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
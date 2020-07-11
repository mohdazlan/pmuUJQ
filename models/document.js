const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/docCovers'
const fileBasePath = 'uploads/Docs'
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date
    },
    pageCount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    coverImageName: {
        type: String
    },
    actualFile: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }

})

documentSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
    console.log(coverImageBasePath +'  '+ this.coverImageName)
})

module.exports = mongoose.model('Document', documentSchema)
module.exports.coverImageBasePath = coverImageBasePath
module.exports.fileBasePath = fileBasePath
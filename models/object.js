const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectSchema = new Schema({
    _id: {
       type: String,
       required: 'Id is required'
    },
    oid: {
        type: String,
        required: 'Id is required'
    },
    size: {
        type: Number,
        required: 'size is required'
    },
    data : {
        type: Object,
        required: 'data is required'
    },
    repositoryType: {
        type: String,
        required: 'repository type is required'
    },
    createdAt: {
        type: Date,
    },
    createdBy: {
        type: String,
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String
    }
});
module.exports = ObjectSchema;
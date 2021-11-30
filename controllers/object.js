
const mongoose = require("mongoose");
const ObjectSchema = require('../models/object.js');
const {info} = require("../loggers/logger.js");
const HTTP_STATUS = require ("http-status");
const errorResponse = require("../errorResponse");
const Object = mongoose.model('User', ObjectSchema);
var hash = require('object-hash');


const putObject = (req, res) => {
    // input validation
    // TODO move to validation middleware
    if(!req.body) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(errorResponse(HTTP_STATUS.BAD_REQUEST, "Body is required."));
        return;
    }
    // logging the request body
    info(req.body);

    const size = Buffer.byteLength(JSON.stringify(req.body))
    const repositoryType = req.params.repositoryType;

    // calculating hash to avoid de-duplication
    const objHash = hash({...req.body, size, repositoryType});

    // Handling de dplucation by using _id which is by default the primary key of mongodb
    // Since _id field is always indexed, and primary key, 
    // Need to make sure that different objectid is generated for each object
    const objectToBeAdded = { _id: objHash, oid: objHash,data: req.body, repositoryType, size: size,createdAt: new Date(), createdBy: "Admin", modifiedBy: "Admin"};
    info(objectToBeAdded);
    let newObject = new Object(objectToBeAdded);
    
    newObject.save((err, obj) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to save the object", err));
            return;
        }
        res.status(HTTP_STATUS.CREATED).send({oid: obj.oid, size: obj.size});
    });
};


const getObject = (req, res) => {
    
    Object.findOne({ oid: req.params.objectId}, (err, object) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to GET the object", err));
            return;
        }
        if (!object) {
            res.status(HTTP_STATUS.NOT_FOUND).send(errorResponse(HTTP_STATUS.NOT_FOUND, "Unable to GET the object"));
            return;
        }
        res.json(object.data);
    });
};

const deleteObject = (req, res) => {
    Object.findOneAndRemove({ oid: req.params.objectId}, (err, object) => {
        if (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to DELETE the object", err));
            return;
        }
        if (!object) {
            res.status(HTTP_STATUS.NOT_FOUND).send(errorResponse(HTTP_STATUS.NOT_FOUND, "Unable to GET the object"));
            return;
        }
        res.status(HTTP_STATUS.OK).send();
    });
};

module.exports = {getObject, deleteObject, putObject};

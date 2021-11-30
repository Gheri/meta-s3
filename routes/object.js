const {putObject, getObject, deleteObject} = require("../controllers/object.js");

const routes = (app) => {
    app.route('/data/:repositoryType')
        .put(putObject);
    app.route('/data/:repositoryType/:objectId')
        .get(getObject)
        .delete(deleteObject);
}

module.exports = routes;
const {putObject, getObject, deleteObject, healthObject} = require("../controllers/object.js");

const routes = (app) => {
    app.route('/health')
        .get(healthObject);
    app.route('/data/:repositoryType')
        .put(putObject);
    app.route('/data/:repositoryType/:objectId')
        .get(getObject)
        .delete(deleteObject);
}

module.exports = routes;

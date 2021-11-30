const objectRoutes = require("./routes/object.js");
const logger = require("./loggers/logger.js") ;
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const errorResponse = require("./errorResponse.js");
const HTTP_STATUS = require("http-status");

const server = express()
const v1 = express.Router();

server.use(express.json());

// for now these are v1 routes
// in case of future improvements we would implement /v2 routes
objectRoutes(v1);
server.use("/", v1);

process.on("uncaughtException", error => {
   logger.info(error);
   process.exit(1);
});
process.on("unhandledRejection", error => {
  logger.info(error);
  process.exit(1);
});

//Global Error Handler
server.use((err, req, res, next) => {
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unknown Error Occurred", err));
})

if (require.main === module) {
  // Start server only when we run this on the command line and explicitly ignore this while testing

  // mongoose connection
  // in test we are connecting and closing the connection
  mongoose.Promise = global.Promise;
  mongoose.connect(config.get("mongoConnectionString"), {
     useNewUrlParser: true,
     useUnifiedTopology: true
  });

  const port = process.env.PORT || 3000
  server.listen((port), () => {
    logger.info(`App listening at http://localhost:${port}`)
  })
}

module.exports = server

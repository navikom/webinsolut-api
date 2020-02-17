require("module-alias/register");

import express, { Response, Request } from "express";
import logger from "morgan";
import { ErrorHandler } from "@app/helpers/ErrorHandler";
import requestLogger from "@app/middleware/logger";
import bindSession from "@app/middleware/bindSession";
import bindUser from "@app/middleware/bindUser";
import ipdata from "@app/middleware/ipData";
import devicedata from "@app/middleware/deviceData";
import appData from "@app/middleware/appData";
import { HTTPStatus } from "@app/helpers/HTTPStatus";

import v1 from "@app/routes/v1";
import CONFIG from "@app/config/config";


const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS") {
    return res.status(HTTPStatus.OK).send();
  }
  next();
});

// JSON
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ip data
app.use(ipdata);

// device data
app.use(devicedata);

// bind session
app.use(bindSession);

// app data
app.use(appData);

//Log requests
app.use(requestLogger);

// bind user
app.use(bindUser);

// log Env
console.log("Environment:", CONFIG.app);

// CORS
// app.use(cors());

app.use("/v1", v1);

app.set("views", "./templates");

app.get("/templates/:file", function (req, res) {
  res.render("index.pug", { name: "there", file: req.params.file, resetLink: "#" });
});

app.post("/templates/:file/:subject/:name", function (req, res) {
  res.render("index.pug", {
    name: req.params.name,
    file: req.params.file,
    subject: req.params.subject,
    resetLink: "#"
  });
});

app.use(express.static("static"));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  return res.status(HTTPStatus.PAGE_NOT_FOUND).send(HTTPStatus.PAGE_NOT_FOUND_MESSAGE);
});

// error handler
app.use((err: ErrorHandler, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use((req, res, next) => {
  const method = req.method;
  const endpoint = req.originalUrl;

  res.on("finish", () => {
    const status = res.status;
    next();
  });
});

process.on("unhandledRejection", error => {
  console.error("Uncaught Error", error);
});

module.exports.app = app;

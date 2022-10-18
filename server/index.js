/*global require, process, __dirname*/
// eslint-disable-next-line no-undef
const express = require("express");
// eslint-disable-next-line no-undef
const bodyParser = require("body-parser");
// eslint-disable-next-line no-undef
const errorHandler = require("errorhandler");
// eslint-disable-next-line no-undef
const morgan = require("morgan");
// eslint-disable-next-line no-undef
const serveIndex = require("serve-index");
// eslint-disable-next-line no-undef
const https = require("https");
// eslint-disable-next-line no-undef
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const manifest = require("../plugin-manifest.json");
const { moduleSupport } = manifest;

process.env.PWD = process.env.PWD || process.cwd();

const expressApp = express();
const port = 5000;

if (moduleSupport) {
  // eslint-disable-next-line no-undef
  const devMiddleware = require("webpack-dev-middleware");
  // eslint-disable-next-line no-undef
  const webpack = require("webpack");
  // eslint-disable-next-line no-undef
  const getWebpackConfig = require("../webpack.config.js");
  const compiler = webpack(getWebpackConfig("development"));

  expressApp.use(
    devMiddleware(compiler, {
      logLevel: "info",
      publicPath: "/app/",
    })
  );
}

expressApp.set("port", port);
expressApp.use(morgan("dev"));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(errorHandler());

expressApp.use("/", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let connectSrc = "";
  let manifest = fs
    .readFileSync(path.join(__dirname, "..", "plugin-manifest.json"))
    .toString();
  manifest = JSON.parse(manifest);
  if (
    manifest != null &&
    manifest.cspDomains != null &&
    manifest.cspDomains["connect-src"] != null
  ) {
    let connectDomains = manifest.cspDomains["connect-src"];
    if (validateDomains(connectDomains)) {
      console.log(
        chalk.bold.red(
          connectDomains + " - found to be invalid URL(s) in connect-src"
        )
      );
      next();
      return false;
    }
    connectSrc = connectDomains.join(" ");
  }
  res.setHeader(
    "Content-Security-Policy",
    "connect-src https://*.zohostatic.com https://*.sigmausercontent.com " +
      connectSrc
  );
  next();
});

expressApp.get("/plugin-manifest.json", function (req, res) {
  let newManifest = fs
    .readFileSync(path.join(__dirname, "..", "plugin-manifest.json"))
    .toString();
  newManifest = JSON.parse(newManifest);
  newManifest.name = path.dirname(__dirname).split(path.sep).pop();
  res.send(newManifest);
});

expressApp.get("/resources.json", function (req, res) {
  var resourceJson = path.join(__dirname, "..", "resources.json");
  if (fs.existsSync(resourceJson)) {
    res.sendfile("resources.json");
  } else {
    res.send({});
  }
});

expressApp.use("/app", express.static("app"));
expressApp.use("/app", serveIndex("app"));

expressApp.get("/", function (req, res) {
  res.redirect("/app");
});

var options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

https
  .createServer(options, expressApp)
  .listen(port, function () {
    console.log(chalk.green("Zet running at ht" + "tps://127.0.0.1:" + port));
    console.log(
      chalk.bold.cyan(
        "Note: Please enable the host (https://127.0.0.1:" +
          port +
          ") in a new tab and authorize the connection by clicking Advanced->Proceed to 127.0.0.1 (unsafe)."
      )
    );
    if (moduleSupport) {
      console.log(chalk.green("Webpack is compiling..."));
    }
  })
  .on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      console.log(chalk.bold.red(port + " port is already in use"));
    }
  });

function validateDomains(domainsList) {
  var invalidURLs = domainsList.filter(function (domain) {
    return !isValidURL(domain);
  });

  return invalidURLs && invalidURLs.length > 0;
}

function isValidURL(url) {
  try {
    var parsedURL = new URL(url);
    if (
      parsedURL.protocol !== "http" + ":" &&
      parsedURL.protocol !== "https" + ":" &&
      parsedURL.protocol !== "wss" + ":"
    ) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}

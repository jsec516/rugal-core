import makeDebug from "debug";
import { init as InitializeDb } from './db';
import { init as InitializeCache } from "./cache";
import { setupParentApp } from './app';
import RugalServer from './rugal-server';

declare var global: any;
// setup globals
global.rugal = { test: 1};
var i18n = require('./i18n');
const debug = makeDebug('rugalC:boot:init');
const Promise = require("bluebird");

interface Server {
  start(parentApp: any);
}

export function init(options): Server {
  debug('Init Start...');

  var rugalCServer, parentApp;
  // Initialize Internationalization
  i18n.init();
  debug('I18n done');

  let dbService = InitializeDb();
  // @TODO: need to make it work, ensure that db connected
  return dbService.ok()
  .then(function buildParentApp() {
    debug('initialize database done');
    parentApp = setupParentApp();
  })
  .then(function rugalServer() {
    debug('Express Apps done');
    return new RugalServer(parentApp);
  });
}

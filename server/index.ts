import makeDebug from "debug";
import { init as InitializeDb } from './db';
import { init as InitializeCache } from "./cache";
import { setupParentApp } from './app';
import { Express } from "express";
import RugalServer from './rugal-server';

var i18n = require('./i18n');
const debug = makeDebug('rugalC:server:index');
const Promise = require("bluebird");

interface Server {
  start(parentApp: any);
}

export function init(options): Server {
  debug('initializing server creation procedure...');

  var rugalCServer, parentApp: Express;
  // Initialize Internationalization
  i18n.init();
  debug('i18n done');

  let dbService = InitializeDb();
  // @TODO: need to make it work, ensure that db connected
  debug('initializing database...');
  return dbService.ok()
  .then(function buildParentApp() {
    debug('database done');
    parentApp = setupParentApp();
  })
  .then(function rugalServer() {
    return new RugalServer(parentApp);
  });
}

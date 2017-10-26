import { Express } from "express";
import makeDebug from "debug";
import { getParentApp } from './app';
import { init as InitializeDb } from './db';
import { init as Initializei18n } from './i18n';
import RugalServer from './rugal-server';

const debug = makeDebug('rugalC:server:index');

interface Server {
  start(parentApp: any);
}

export function init(options): Server {
  debug('initializing server creation procedure...');

  let parentApp: Express,
      dbService;
  // Initialize Internationalization
  Initializei18n();
  debug('i18n done');

  dbService = InitializeDb();
  // @TODO: need to make it work, ensure that db connected
  debug('initializing database...');
  return dbService.ok()
  .do(function buildParentApp() {
    debug('database done');
    parentApp = getParentApp();
  })
  .map(function rugalServer() {
    return new RugalServer(parentApp);
  });
}

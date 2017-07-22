import * as chalk from 'chalk';
import makeDebug from "debug";
import * as moment from 'moment';
import * as config from './config';
import events from './events';
import { t } from "./i18n";
import { BaseError } from "./errors";
import { urlFor } from './utils';
import { Express } from "express";
const debug = makeDebug('rugalC:server:rugal-server');

export default class RugalServer {
  public httpServer;
  public connections;
  public connectionId;
  public config;

  constructor(public rootApp) {
    debug('initializing RugalServer...');
    this.httpServer = null;
    this.connections = {};
    this.connectionId = 0;

    // Expose config module for use externally.
    this.config = config;
    debug('RugalServer done');
  }

  /**
   * Starts the rugal server listening on the configured port.
   * Alternatively you can pass in your own express instance and let Rugal
   * start listening for you.
   * @param  {Object} externalApp - Optional express app instance.
   * @return {Promise} Resolves once Rugal has started
   */
   start(externalApp: Express): Promise<RugalServer> {
      debug('starting RugalServer...');
      let rootApp: Express = externalApp ? externalApp : this.rootApp;
      return new Promise((resolve, reject) => {
        this.httpServer = rootApp.listen(
          config.get('server').port,
          config.get('server').host
        );

        let errorHandler = (error) => {
            let rugalError;

            if (error.errno === 'EADDRINUSE') {
                rugalError = new BaseError({
                    message: t('errors.httpServer.addressInUse.error'),
                    context: t('errors.httpServer.addressInUse.context', {port: config.get('server').port}),
                    help: t('errors.httpServer.addressInUse.help')
                });
            } else {
                rugalError = new BaseError({
                    message: t('errors.httpServer.otherError.error', {errorNumber: error.errno}),
                    context: t('errors.httpServer.otherError.context'),
                    help: t('errors.httpServer.otherError.help')
                });
            }

            reject(rugalError);
        };

        this.httpServer.on('error', errorHandler);
        this.httpServer.on('connection', this.connection.bind(this));
        this.httpServer.on('listening', () => {
            debug('...Started');
            events.emit('server:start');
            this.logStartMessages();
            resolve(this);
        });
      });
   }

   /**
   * Handles the connection event of server
   * @param {Object} socket
   */
   private connection(socket) {
      this.connectionId += 1;
      socket._ghostId = this.connectionId;
      let closeHandler = () => {
          delete this.connections[socket._ghostId];
      }
      socket.on('close', closeHandler);
      this.connections[socket._ghostId] = socket;
   }

   /**
   * log necessary messages when server starts
   */
   private logStartMessages() {
       // Startup & Shutdown messages
    if (config.get('env') === 'production') {
        console.log(
            chalk.red('Currently running Rugal 1.0.0 Beta \n'),
            chalk.gray(t('notices.httpServer.ctrlCToShutDown'))
        );
    } else {
        console.log(
            chalk.yellow('Welcome to the Rugal 1.0.0 Alpha - this version of Rugal is for development only.')
        );
        console.log(
            chalk.green(t('notices.httpServer.rugalIsRunningIn', {env: config.get('env')})),
            t('notices.httpServer.listeningOn'),
            config.get('server').socket || config.get('server').host + ':' + config.get('server').port,
            t('notices.httpServer.urlConfiguredAs', {url: urlFor('home', true)}),
            chalk.gray(t('notices.httpServer.ctrlCToShutDown'))
        );
    }

    // ensure that Rugal exits correctly on Ctrl+C and SIGTERM
    process.
        removeAllListeners('SIGINT').on('SIGINT', this.shutdown).
        removeAllListeners('SIGTERM').on('SIGTERM', this.shutdown);

   }

   /**
   * log shudown messages for server
   */
   private shutdown() {
        console.log(chalk.red(t('notices.httpServer.rugalHasShutdown')));

        if (config.get('env') === 'production') {
            console.log(
                t('notices.httpServer.yourAppIsNowOffline')
            );
        } else {
            console.log(
                t('notices.httpServer.rugalWasRunningFor'),
                moment.duration(process.uptime(), 'seconds').humanize()
            );
        }

        process.exit(0);
    }
}

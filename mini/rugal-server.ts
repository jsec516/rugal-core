export default class RugalServer {
    public httpServer;
  public connections;
  public connectionId;
  public config;

    constructor(public rootApp) {
    }

    start(externalApp?) {
      let rootApp = externalApp ? externalApp : this.rootApp;
      // this.httpServer = 
      rootApp.listen(
          2368
        );
      // get the list of routes
      // const all_routes = require('express-list-endpoints');
      // console.log(all_routes(rootApp));
      // return new Promise((resolve, reject) => {
        

      //   let errorHandler = (error) => {
      //       reject(error);
      //   };

      //   this.httpServer.on('error', errorHandler);
      //   this.httpServer.on('listening', () => {
      //       resolve(this);
      //   });
      // });
   }
}
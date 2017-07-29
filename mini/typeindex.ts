import { setupParentApp } from './app';
import RugalServer from './rugal-server';

interface Server {
  start(parentApp: any);
}

export function init(options): Server {
    var pApp = setupParentApp();
    return new RugalServer(pApp);
}
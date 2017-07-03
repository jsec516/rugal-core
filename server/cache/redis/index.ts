import { IProvider } from '../iprovider';

export function init(options) {
    return new RedisClient(options);
}

export class RedisClient implements IProvider{

    constructor(options) {

    }

    get(key) {

    }

    set(key, value) {

    }
}

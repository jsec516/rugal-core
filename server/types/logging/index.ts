export interface LoggerOptions {
    env?: string;
    domain?: string;
    transports?: Array<any>;
    level?: string;
    mode?: string;
    path?: string;

    [key: string]: any;
}
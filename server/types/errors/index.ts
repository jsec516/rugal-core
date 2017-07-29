export type ErrorLevel = "normal" | "critical" | any;

export interface ErrorOptions {
    id?: string;
    context?: any;
    errorType?: string;
    help?: string;
    level?: ErrorLevel;
    message?: string;
    statusCode?: number;
    err?: any;
    /**
    * Other options
    */   
    [key: string]: any;
} 
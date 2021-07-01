export interface DatabaseInterface {
    host: string;
    user: string;
    database: string;
    password: string;
    port: number;
    connStr?: string;
    connectionTimeoutMillis?: number,
    idleTimeoutMillis?: number,
    max?: number,
}

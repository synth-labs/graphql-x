import dotenv from "dotenv";

import { createPool, Pool } from "mysql2/promise";

dotenv.config();

let connection: Pool;

const db = {
    init() {
        if (!connection) {
            connection = createPool({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                dateStrings: false,
            });
        }
    },
    get() {
        if (!connection) {
            throw new Error('The database pool has not been initialized.');
        }

        return connection;
    }
};

export default db;
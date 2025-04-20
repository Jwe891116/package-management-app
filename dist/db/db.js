"use strict";
// src/db/db.ts
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Create a connection pool
const pool = new pg_1.Pool({
    user: 'packages', // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'packages', // Replace with your PostgreSQL database name
    password: 'Jwe1989!', // Replace with your PostgreSQL password
    port: 5432,
});
exports.default = pool; // Export the pool to be used in other parts of the application

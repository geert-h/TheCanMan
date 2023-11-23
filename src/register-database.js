require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = __dirname + "/" + process.env.DATABASE_NAME + ".db";

const database = new sqlite3.Database(databasePath);

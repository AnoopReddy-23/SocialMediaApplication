require('dotenv').config()

module.exports={
    DATABASE_CONNECTION:process.env.DATABASE_CONNECTION,
    JWT_SECRET: process.env.JWT_SECRET,
}
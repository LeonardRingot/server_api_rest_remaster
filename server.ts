import dotenv from "dotenv";
dotenv.config();

import cors from 'cors'
import { apiController } from './controllers/apiController';
const sequelize = require('./database/connect')
import express from "express"
import { Response, Request, NextFunction } from 'express';
const app = express()

app.use(cors())
import { ApiException } from './types/exception'
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
app.use(express.json())
//sequelize.initDb()

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

app.get("/", (req : Request, res : Response) => {
    res.send("SWAGGER : /api/docs")
})
app.use('/api', apiController)


export default app

// app.use(({res : ApiException}: any) => {
//     const message = 'Ressource not found.'
//     return ApiException.status(404).json({message})
// })
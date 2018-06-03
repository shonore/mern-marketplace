import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'

const app = express()

//serve HTML template at the root URL by sending it
//in the response to a GET request for the '/' route
app.get('/', (req,res) => {
  res.status(200).send(Template())
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

export default app

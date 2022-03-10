const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes/index')

//middleware
app.use(cors())

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS, () => console.log('Database Connected'))

//bodyParser
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/users', routes)

app.all('*', (req, res) => res.send('That route does not exist!'))

app.listen(4000, () => console.log('Server is listening on port 4000'))

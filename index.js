const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/author', (req, res) => {
    res.send('Chethan S Poojary')
})

app.get('/about', (req, res) => {
    res.send('<h1>Chethan S Poojary</h1>')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


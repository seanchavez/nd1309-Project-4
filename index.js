const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => res.json({payload: "Sanity Check"}))

app.listen(port, () => console.log(`Running on ${port}`))
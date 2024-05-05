const express = require('express')
const userRoutes = require('./src/routes/user.routes')
const logger = require('./src/util/logger')

const app = express()

// express.json zorgt dat we de body van een request kunnen lezen
app.use(express.json())

const port = process.env.PORT || 3000

// Deze route geeft de student information
app.get('/api/info', (req, res) => {
    console.log('GET /api/info')
    const info = 
    res.json({
        studentName: 'Renze Westerink',
        studentNumber: 2217105,
        description: 'This is a simple Nodejs Express server'
    })
})

// Hier komen alle routes
app.use(userRoutes)

// Route error handler
app.use((req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
})

// Hier komt je Express error handler te staan!
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {}
    })
})

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
})

// Deze export is nodig zodat Chai de server kan opstarten
module.exports = app

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 4000
const Sequelize = require('sequelize')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres',
    { define: { timestamps: false } })


const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
}, {
        tableName: 'houses'
    })

House.sync()

app.use(bodyParser.json())
app.listen(port, () => `Listening on port ${port}`)

app.get('/houses', function (req, res, next) {
    House.findAll()
        .then(houses => {
            res.json({ houses: houses })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})

app.get('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House.findByPk(id).then(houses => {
        res.json({ message: `Read house ${id}` })
    })
})

app.post('/houses', function (req, res) {
    console.log('Incoming data: ', req.body)
    res.json({ message: 'Create a new house' })
})

app.post('/houses', function (req, res) {
    House
        .create(req.body)
        .then(house => res.status(201).json(house))
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})

House.create({
    title: 'Multi Million Estate',
    description: 'This was build by a super-duper rich programmer',
    size: 1235,
    price: 98400000
}).then(house => console.log(`The house is now created. The ID = ${house.id}`))
// this creates the houses table in your database when your app starts

app.put('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House
        .findByPk(id)
        .then(house => house.update(house))
        .then(house => res.status(200).json({
            message: `The house with ID ${house.id} is now updated`
        }))
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})

app.delete('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House
        .findByPk(id)
        .then(house => house.destroy(house))
        .then(house => res.status(200).json({
            message: `The house with ID ${id} is now deleted`
        }))
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})
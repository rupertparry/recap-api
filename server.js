const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const mongoDB = `mongodb://admin:awfoien28n3i2b4@recap-shard-00-00-tw3ov.mongodb.net:27017,recap-shard-00-01-tw3ov.mongodb.net:27017,recap-shard-00-02-tw3ov.mongodb.net:27017/test?ssl=true&replicaSet=Recap-shard-0&authSource=admin`
const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const typeRegexp = /(article|video|audio)/

const app = express()
mongoose.connect(mongoDB)
const Schema = mongoose.Schema
const db = mongoose.connection

app.use(bodyparser.json())

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    match: urlRegexp,
    required: true
  },
  type: {
    type: String,
    match: typeRegexp,
    required: true
  },
})

const Item = mongoose.model('Item', ItemSchema)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/items', (req, res) => {
  Item.find((err, items) => {
    res.json(items)
  })
})

app.get('/item/:id', (req, res) => {
  Item.find({'_id': req.params.id}, (err, item) => {
    res.json(item)
  })
})

app.post('/items', (req, res) => {
  const item = new Item({
    name: req.body.name,
    url: req.body.url,
    type: req.body.type,
  })

  item.save((err) => {
    if (err) {
      console.log('Error saving.')
    } else {
      console.log('Item saved! ' + item)
      res.sendStatus(200)
    }
  })
})

app.delete('/item/:id', (req, res) => {
  Item.remove({'_id': req.params.id}, (err, item) => {
    if (err) {
      console.log('Error deleting.')
    } else {
      console.log('Delete successful!')
      res.sendStatus(200)
    }
  })
})

app.put('/item/:id', (req, res) => {
  Item.update({'_id': req.params.id}, req.body, (err, item) => {
    if (err) {
      console.log('Error updating.')
    } else {
      console.log('Update successful!')
      res.sendStatus(200)
    }
  })
})

app.listen(3000)

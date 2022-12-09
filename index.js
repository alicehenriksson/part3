const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Morgan
morgan.token('content', function(req,res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res[content] :content'))

// Persons array
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// Generate id, length + 1
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
// Genereate random id
const randomId = () => {
    return Math.floor(Math.random() * 10000000)
}
// Get all data from persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
// Info page, how many entries + time and date
app.get('/api/info',(request,response) => {
    const entries = persons.length
    const date = new Date()
    response.send(`

        <div>Phonebook has info for ${entries} people</div>
        <div>${date}</div>
    
    `)
})
// Get data for unique id
app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
// Delete an entry
app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
// Add an entry
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Error handling:
    if (!body.name) {
        return response.status(400).json({ 
            error: 'Name missing' 
        })
    } 
    if (!body.number) {
        return response.status(400).json({ 
            error: 'Number missing' 
        })
    } 
    if (persons.find(person => person.name === body.name)) {
        return response.status(409).json({ 
            error: 'Name is already taken!' 
        })
    } 

    const person = {
        id: randomId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})
// Unkown endpoint
const unknownEndpoint = (request,response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

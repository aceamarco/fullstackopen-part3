const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())


// Define a custom log format that includes request body for POST requests
morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

// Use the custom log format 'combined-with-body'
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const MAX = 100;

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p/><br/><p>${new Date()}<p/>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id)
  if (person === undefined) {
    response.status(404).end()
  } else {
    response.json(person)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)

  response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  if (!persons.find(p=>p.name == body.name)){
    return response.status(400).json({error: 'name must be unique'})
  }

  const newPerson = {
    id: Math.floor(Math.random() * MAX),
    name: body.name,
    number: body.number
  };

  persons = [...persons, newPerson];
  response.json(newPerson);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import {useState,useEffect} from 'react'
import personServices from './services/persons'

const FilterForm = ({newFilter,setNewFilter}) => {
  const handleFilterChange = (event) => setNewFilter(event.target.value)
  return (
    <form>
      <div>Filter: <input value={newFilter} onChange={handleFilterChange}></input></div>
    </form>
  )
}

const PersonForm = ({persons,setPersons,newName,setNewName,newNumber,setNewNumber}) => {
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const addInput = (event) => {
    event.preventDefault()

    const input = {
      name: newName,
      number: newNumber
    }

    personServices
      .create(input)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson])
        setNewName('')
        setNewNumber('')
      })
  } 

  
  return (
    <form onSubmit={addInput}>
      <div>Name: <input value={newName} onChange={handleNameChange}/></div>
      <div>Number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div><button type="submit">Add</button></div>
    </form>
  )
}

const Persons = ({persons,setPersons,newFilter}) => {
  const remove = (id) => {
    personServices
      .remove(id)
      .then(updatedPersons => {
        console.log(updatedPersons)
        setPersons(updatedPersons)
      })
  }
  const filtered = persons.filter(person => 
    person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  )
  return filtered.map(person =>
    <OnePerson 
      key={person.id} 
      name={person.name} 
      number={person.number} 
      remove={() => remove(person.id)}
    />
  )
}

const OnePerson = ({name,number,remove}) => (
  <div>
    {name} {number}<button onClick={remove}>Delete</button>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [newFilter,setNewFilter] = useState('')

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },[])

  return (
    <div>
      <h1>Phonebook</h1>
        <FilterForm 
          newFilter={newFilter} 
          setNewFilter={setNewFilter} 
        />
      <h2>Add new entry:</h2>
        <PersonForm 
          persons={persons} 
          setPersons={setPersons} 
          newName={newName} 
          setNewName={setNewName} 
          newNumber={newNumber} 
          setNewNumber={setNewNumber} 
        />
      <h2>Numbers:</h2>
        <Persons 
          persons={persons} 
          setPersons={setPersons}
          newFilter={newFilter}
        />
    </div>
  )
}

export default App
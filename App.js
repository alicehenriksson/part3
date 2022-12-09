import {useState,useEffect} from 'react'
import personService from './services/persons'

const errorStyle = {
  color: 'green',
  fontSize: 30,
  marginBottom: 10,
  borderRadius: 2,
  height: 'auto',
  width: 'fit-content',
}
const errorStyle2 = {
  color: 'red',
  fontSize: 25,
  marginBottom: 10,
  borderRadius: 2,
  height: 'auto',
  width: 'fit-content',
}

const Notification = ({message,errorCheck}) => { 
  if (message === null) {
    return null
  }
  if (errorCheck === true) {
    return (
      <div style={errorStyle2}>
        {message}
      </div>
    )
  }
  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}
const FilterForm = ({newFilter,setNewFilter}) => {
  const handleFilterChange = (event) => setNewFilter(event.target.value) //Update text field
  return (
    <form>
      <div>Filter: <input value={newFilter} onChange={handleFilterChange}></input></div>
    </form>
  )
}

const PersonForm = ({persons,setPersons,newName,setNewName,newNumber,setNewNumber,setErrorMessage,setErrorCheck}) => {
  const handleNameChange = (event) => setNewName(event.target.value)  //Update text field
  const handleNumberChange = (event) => setNewNumber(event.target.value) //Update text field

  const addInput = (event) => {
    event.preventDefault()
    const input = {
      name: newName,
      number: newNumber
    }
    //Check if name already exists
    if (persons.some(e => e.name.toLowerCase() === newName.toLowerCase())) { 
      if (persons.number !== input.number) {
        if (window.confirm(`${input.name} is already added to the phonebook, update number instead?`)) {

          //Update number
          const current = persons.find(n => n.name === input.name)

          personService
            .update(current.id,input)
            .then(() => {
              setErrorMessage(`Updated: ${current.name}!`)
              setTimeout(() => {
                setErrorMessage('')
              },2000)
              setNewName('')
              setNewNumber('')

              personService
                .getAll()
                .then(initialPersons => {
                  setPersons(initialPersons)
                })
            })
            .catch(() => {
              setErrorCheck(true)
              setErrorMessage(`Information on ${current.name} has already been removed`)
              
              setTimeout(() => {
                setErrorMessage('')
                setErrorCheck(false)
              },2000)
            })

        }
        setNewName('')
        setNewNumber('')
        return
      }
      alert(`${newName} is already taken!`)
    }
      
    personService
      .create(input)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setErrorMessage(`Added: ${returnedPerson.name}!`)
        setTimeout(() => {
          setErrorMessage('')
        },2000)
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

//Render list of persons and numbers
const Persons = ({persons,newFilter,removeEntry}) => {
  const lowerCased = newFilter.toLowerCase()
  const filtered = persons.filter(person => person.name.toLowerCase().includes(lowerCased) === true)
  return filtered.map(person =>
    <Person key={person.id} name={person.name} number={person.number} remove={() => removeEntry(person.id)}/>
  )
}

const Person = ({name,number,remove}) => (
  <div>
    {name} {number}
    <button onClick={remove}>Delete</button>
  </div>
)

//---------------------------Render App:---------------------------------

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [newFilter,setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorCheck,setErrorCheck] = useState(false)

  useEffect(() => { 
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removeEntry = (id) => {
    if (window.confirm("Do you want to delete this entry?")) {
      const updatedList = persons.filter(n => n.id !== id)
      personService
        .remove(id)
        .then(_response => {
          setPersons(updatedList)
          setErrorMessage('Deleted entry')
          setTimeout(() => {
            setErrorMessage('')
          },2000)
        })
        .catch(() => {
          setErrorCheck(true)
          setErrorMessage(`That entry has already been deleted`)
          setTimeout(() => {
            setErrorMessage('')
            setErrorCheck(false)
          },2000)
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification 
        message={errorMessage} 
        setErrorMessage={setErrorMessage}
        errorCheck={errorCheck}
      />
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
          setErrorMessage={setErrorMessage}
          setErrorCheck={setErrorCheck}
        />
      <h2>Numbers:</h2>
        <Persons 
          persons={persons} 
          newFilter={newFilter}
          removeEntry={removeEntry} 
        />
    </div>
  )
}

export default App
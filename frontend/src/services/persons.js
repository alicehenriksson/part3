import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl,newObject)
    return request.then(response => response.data)
}

const remove = objectId => {
    const request = axios.delete(`${baseUrl}/${objectId}`)
    return request.then(response => response.data)
}

const update = (objectId,newData) => {
    const request = axios.put(`${baseUrl}/${objectId}`,newData)
    return request.then(response => response.data)
}

export default {getAll, create, remove, update}
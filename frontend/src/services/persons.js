import axios from 'axios'
const baseUrl = 'https://www.backend-production-2130.up.railway.app/api/persons'
const token = '67bff9cb-ede9-4fbe-99cd-ef341edd862e'

const getAll = () => {
    const request = axios.get(baseUrl,{
        headers: {
            'Authorization': `Bearer ${token}`
         }
    })
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl,newObject,{
        headers: {
            'Authorization': `Bearer ${token}`
         }
    })
    return request.then(response => response.data)
}

const remove = objectId => {
    const request = axios.delete(`${baseUrl}/${objectId}`,{
        headers: {
            'Authorization': `Bearer ${token}`
         }
    })
    return request.then(response => response.data)
}

const update = (objectId,newData) => {
    const request = axios.put(`${baseUrl}/${objectId}`,newData,{
        headers: {
            'Authorization': `Bearer ${token}`
         }
    })
    return request.then(response => response.data)
}

const exportedObjects = {getAll, create, remove, update}

export default exportedObjects
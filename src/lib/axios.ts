import axios from 'axios';

export const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

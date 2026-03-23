import axios from 'axios';

export const api = axios.create({
    baseURL: '/api/v1/',
});

export const userVerify = async () => {
    let token = localStorage.getItem('token')
    if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        let response = await api.get('users/')
        if (response.status === 200) {
            let user =response.data.email
            console.log("User Verified")
            return user
        } else {
            alert("User Not Verified")
            console.error(response.data)
            return null
        }
    }
    return null
}

export const handleUserAuth = async( data, create ) => {
   
    let response = await api.post(`users/${create ? 'create' : 'login'}/`,
        data)
   
    if (response.status === 201 || response.status === 200){
        let token = response.data.token
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        localStorage.setItem("token", token)
        return response.data.email
    }
    else{
        alert(response.data)
        return null
    }
}
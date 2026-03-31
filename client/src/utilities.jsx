import axios from 'axios';

export const api = axios.create({
    baseURL: '/api/v1/',
});

export const userVerify = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    api.defaults.headers.common['Authorization'] = `Token ${token}`

    try {
    const response = await api.get('users/');
    if (response.status === 200) {
    return response.data.email;
    }
    return null;
    } catch (error) {
    if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    return null;
    }
    throw error;
    }
};

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

export const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
}

export const fetchTownies = async () => {
    try {
        const response = await api.get('townies/');
        if (response.status === 200) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching townies:', error);
        return [];
    }
}

export const fetchATownie = async (name) => {
    try {
        const response = await api.get(`townies/${name}/`);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching townie:', error);
        return null;
    }
}

export const fetchTrackedQuests = async () => {
    try {
        const response = await api.get('tasks/');
        if (response.status === 200) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching tracked quests:', error);
        return [];
    }
}

export const createTrackedQuest = async (townieId, currentAmount = 0) => {
    const response = await api.post('tasks/', {
        townie_id: townieId,
        current_amount: currentAmount,
    });
    return response.data;
}

export const updateTrackedQuestAmount = async (questProgressId, currentAmount) => {
    const response = await api.patch(`tasks/${questProgressId}/`, {
        current_amount: currentAmount,
    });
    return response.data;
}

export const incrementTrackedQuestAmount = async (questProgressId, amount) => {
    const response = await api.post(`tasks/${questProgressId}/increment/`, {
        amount,
    });
    return response.data;
}
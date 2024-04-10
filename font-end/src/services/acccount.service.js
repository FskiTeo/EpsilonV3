let savetoken = (token) => {
    localStorage.setItem('token', token);
}

let logout = () => {
    localStorage.removeItem('token');
}

let isLogged = () => {
    let token = localStorage.getItem('token');
    return !!token;
}

export const accountService = { savetoken, logout, isLogged };

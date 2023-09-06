export function saveJWT(jwtToken) {
    window.localStorage.setItem('jwt_token', jwtToken);
}

export function getJWT() {
    return window.localStorage.getItem('jwt_token');
}

export function saveUserName(userName) {
    window.localStorage.setItem('jwtUserName', userName);
}

export function getUserName() {
    return window.localStorage.getItem('jwtUserName');
}
export function deleteToken() {
    window.localStorage.removeItem('jwt_token');
    window.localStorage.removeItem('jwtUserName');
}
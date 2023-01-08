import Cookies from "js-cookie";

export const getTokenCookie = () => {
    Cookies.get("token")
}

export const setTokenCookie = (token) => {
    Cookies.set("token", token, {expires: 1/24})
}

export const removeTokenCookie = () => {
    Cookies.remove("token")
}
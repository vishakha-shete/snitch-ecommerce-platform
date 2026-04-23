import { setError, setLoading, setUser } from "../../state/auth.slice";
import { register, login, getMe } from "../../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister({ email, contact, fullname, password, isSeller = false }) {
        let data;
        try {
            dispatch(setLoading(true));
            data = await register({ email, contact, fullname, password, isSeller })
            dispatch(setUser(data.user))
        } catch (err) {
            const message = err?.message || "Registration failed";
            dispatch(setError(message));
            throw err; // Throw the original error object (which contains .errors if from express-validator)
        } finally {
            dispatch(setLoading(false));
        }
        return data?.user;
    }

    async function handleLogin({ email, password }) {
        let data;
        try {
            dispatch(setLoading(true));
            data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (err) {
            const message = err?.message || "Login failed";
            dispatch(setError(message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
        return data?.user;
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            console.log(err);
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister, handleLogin, handleGetMe
    }
}

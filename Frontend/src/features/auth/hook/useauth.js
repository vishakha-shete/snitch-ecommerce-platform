import { setError, setLoading, setUser } from "../../state/auth.slice";
import { register ,login} from "../../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth =()=>{

    const dispatch = useDispatch();

    async function handleRegister({email,contact,fullname,password, isSeller = false}){
        try {
            dispatch(setLoading(true));
            const data = await register({email,contact,fullname,password, isSeller})
            dispatch(setUser(data.user))
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Registration failed";
            dispatch(setError(message));
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({email,password}){
        try {
            dispatch(setLoading(true));
            const data = await login({email,password})
            dispatch(setUser(data.user))
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Login failed";
            dispatch(setError(message));
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }


    return {
        handleRegister , handleLogin
    }
}
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserForm from "./UserForm";
import Cookies from "js-cookie";

export default function LoginPage()
{
    const [userFormData, setUserFormData] = useState({username: "", password: ""});
    const [postResponse, setPostResponse] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/login", {
                ... userFormData,
            });
            setPostResponse(response.data.message);
            if (response.status === 201) {
                navigate("/main");
                Cookies.set("jwt-authorization", response.data.token);
            }
        } catch (error) {
            setPostResponse(error.response.message || "Login Failed");
        }
    }

    const handleOnChange = (e) => {
        setUserFormData((prevData) => {
            return { ... prevData, [e.target.name]: e.target.value };
        });
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleLogin();
        setUserFormData({ username: "", password: ""});
    };

    return (
        <div>
            <h1>Groceries App</h1>
            <UserForm userFormData={userFormData}
                postResponse={postResponse}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
                buttonLabel="Login"
            />
            <p>Not a member yet? Click <a onClick={() => navigate("/create-user")}>here</a> to join!</p>
        </div>
    )

}
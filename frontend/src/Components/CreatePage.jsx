import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserForm from "./UserForm";
import Cookies from "js-cookie";

export default function CreatePage()
{
    const [userFormData, setUserFormData] = useState({username: "", password: ""});
    const [postResponse, setPostResponse] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://localhost:3000/create-user", {
                ... userFormData,
            });
            setPostResponse(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnChange = (e) => {
        setUserFormData((prevData) => {
            return { ... prevData, [e.target.name]: e.target.value };
        });
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        handleRegister();
        setUserFormData({ username: "", password: ""});
    };

    return (
        <div>
            <h2>Create a new user</h2>
            <UserForm userFormData={userFormData}
                postResponse={postResponse}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
                buttonLabel="Create User"
            />
            <a onClick={() => navigate("/")}>Back to login page</a>
        </div>
    )

}
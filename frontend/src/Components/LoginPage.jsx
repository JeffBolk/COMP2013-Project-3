import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import UserForm from "./UserForm";
import Cookies from "js-cookie";

export default function LoginPage() {
  //State to track user form data
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });
  const [postResponse, setPostResponse] = useState("");

  const navigate = useNavigate();

  //Handlers

  //A handler to login user
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        ...userFormData,
      });
      setPostResponse(response.data.message);
      //If login is successful, navigate to main page and set jwt-authorization cookie
      if (response.status === 201) {
        navigate("/main");
        Cookies.set("jwt-authorization", response.data.token); //set jwt token in cookies
      }
    } catch (error) {
        setPostResponse(error.response.data.message || "Login Failed");
    }
  };

  //Handler to track changes in user form inputs
  const handleOnChange = (e) => {
    setUserFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  //Handler for form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleLogin();
    setUserFormData({ username: "", password: "" });
  };

  return (
    <div>
      <h1>Groceries App</h1>
      <UserForm
        userFormData={userFormData}
        postResponse={postResponse}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        buttonLabel="Login"
      />
      <p>Not a member yet? Click <Link to="/create-user">here</Link> to join!</p>
    </div>
  );
}

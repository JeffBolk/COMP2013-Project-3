import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
export default function ProductForm() {
  const [postResponse, setPostResponse] = useState(""); //State to track post response
  const [isEditing, setIsEditing] = useState(false); //State to track if editing or adding product
  const navigate = useNavigate(); //Navigate is used to redirect user to different pages
  //State to fetch current user, if any
  const [currentUser] = useState(() => {
    const jwtToken = Cookies.get("jwt-authorization"); //get jwt token from cookies
    if (!jwtToken) {
      //if no token,
      return "";
    }
    try {
      const decodedToken = jwtDecode(jwtToken); //decode token
      return decodedToken.username;
    } catch {
      return "";
    }
  });

  //State to track form data
  const [formData, setFormData] = useState(() => {
    const jwtToken = Cookies.get("jwt-token"); //get jwt token from cookies
    if (!jwtToken) {
      //if no token,
      //return empty form data
      setIsEditing(false);
      return {
        productName: "",
        brand: "",
        image: "",
        price: "",
        id: "",
        _id: "",
      };
    }
    //If token exists, decode it and pre-fill form data for editing
    try {
      const decodedToken = jwtDecode(jwtToken);
      setIsEditing(true);
      return {
        productName: decodedToken.productName,
        brand: decodedToken.brand,
        image: decodedToken.image,
        price: decodedToken.price,
        id: decodedToken.id,
        _id: decodedToken._id,
      };
    } catch {
      //If error in decoding, return empty form data
      setIsEditing(false);
      return {
        productName: "",
        brand: "",
        image: "",
        price: "",
        id: "",
        _id: "",
      };
    }
  });

  //Redirect to add-product page if not editing
  useEffect(() => {
    if (!isEditing) {
      navigate("/add-product");
    }
  }, [isEditing]);

  //Redirect to not authorized page if current user is not admin
  useEffect(() => {
    if (currentUser != "admin") {
      navigate("/not-authorized");
    }
  });

  //Handlers

  //Handler for form input changes
  const handleOnChange = (e) => {
    //console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    //console.log(formData);
  };

  //Handler for form submission
  const handleOnSubmit = async (e) => {
    if (isEditing) {
      //console.log(formData)
      e.preventDefault();
      handleUpdateProduct();
      setIsEditing(false);
    } else {
      e.preventDefault();
      try {
        await axios
          .post("http://localhost:3000/add-product", formData)
          .then((result) => {
            setPostResponse(result.data);
          });
        setFormData({
          productName: "",
          brand: "",
          image: "",
          price: "",
          id: "",
          _id: "",
        });
        navigate("/main");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //Handler to update product
  const handleUpdateProduct = async () => {
    try {
      await axios
        .patch("http://localhost:3000/products", formData)
        .then((result) => {
          setPostResponse(result.data);
        });
      setFormData({
        productName: "",
        brand: "",
        image: "",
        price: "",
        id: "",
        _id: "",
      });
      setIsEditing(false);
      navigate("/main");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="product-form">
      <h2>Product Form</h2>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          id="productName"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleOnChange}
        />
        <br />

        <input
          type="text"
          id="brand"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleOnChange}
        />
        <br />

        <input
          type="text"
          id="image"
          name="image"
          placeholder="Image Link"
          value={formData.image}
          onChange={handleOnChange}
        />
        <br />

        <input
          type="text"
          id="price"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleOnChange}
        />
        <br />
        <button type="submit">{isEditing ? "Edit" : "Submit"}</button>
      </form>
      <Link to="/main">Back to Main Page</Link>
      {postResponse && <p>{postResponse}</p>}
    </div>
  );
}

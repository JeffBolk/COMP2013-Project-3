import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
export default function ProductForm() {
  const [postResponse, setPostResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentUser] = useState(() => {
    const jwtToken = Cookies.get("jwt-authorization");
    if (!jwtToken) {
      return "";
    }
    try {
      const decodedToken = jwtDecode(jwtToken);
      return decodedToken.username;
    } catch {
      return "";
    }
  });

  const [formData, setFormData] = useState(() => {
    const jwtToken = Cookies.get("jwt-token");
    if (!jwtToken) {
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
  useEffect(() => {
    if (!isEditing) {
      navigate("/add-product");
    }
  }, [isEditing]);

  useEffect(() => {
    if (currentUser != "admin") {
      navigate("/not-authorized");
    }
  });

  const handleOnChange = (e) => {
    //console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    //console.log(formData);
  };

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

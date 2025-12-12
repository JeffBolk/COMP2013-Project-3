import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode} from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
export default function ProductForm() {
  const [postResponse, setPostResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate =useNavigate();
    const [formData, setFormData] = useState(()=>{
        const jwtToken = Cookies.get("jwt-token");
        if (!jwtToken)
        {
            setIsEditing(false);
            return ({
              productName: "",
              brand: "",
              image: "",
              price: "",
              id: "",
            });
        }
        try{
            const decodedToken = jwtDecode(jwtToken);
            setIsEditing(true);
            return ({
              productName: decodedToken.productName,
              brand: decodedToken.brand,
              image: decodedToken.image,
              price: decodedToken.price,
              id: decodedToken.id
            });;
        }catch{
            setIsEditing(false);
            return ({
              productName: "",
              brand: "",
              image: "",
              price: "",
              id: "",
            });
        }
    });
    useEffect(()=>{
        if (!isEditing)
        {
            navigate("/add-product");
        }
    },[isEditing]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    if (isEditing) {
      e.preventDefault();
      handleUpdateProduct(formData.id);
      setIsEditing(false);
      setFormData({
        productName: "",
        brand: "",
        image: "",
        price: "",
        id: "",
      });
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
        .patch(`http://localhost:3000/products/${formData.id}`, formData)
        .then((result) => {
          setPostResponse(result.data);
        });
      setFormData({
        productName: "",
        brand: "",
        image: "",
        price: "",
        id: "",
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
      {postResponse && <p>{postResponse}</p>}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import FilterForm from "./FilterForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function GroceriesAppContainer() {
  /////////// States ///////////
  const [productQuantity, setProductQuantity] = useState();
  const [cartList, setCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [postResponse, setPostResponse] = useState("");
  const [productsDisplay, setProductsDisplay] = useState([]); // New state for filtered products
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

  const navigate = useNavigate();
  //////////useEffect////////

  useEffect(() => {
    handleProductsFromDB();
    if (Cookies.get("jwt-token")) {
      Cookies.remove("jwt-token");
    }
  }, [postResponse]);

  ////////Handlers//////////
  const initialProductQuantity = (prods) =>
    prods.map((prod) => {
      return { id: prod.id, quantity: 0 };
    });

  const handleProductsFromDB = async () => {
    try {
      await axios.get("http://localhost:3000/products").then((result) => {
        setProductList(result.data);
        setProductsDisplay(result.data); // Initialize filtered products to show all products
        setProductQuantity(initialProductQuantity(result.data));
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //Handler to filter products by price
  const handleFilterPrice = (e) => {
    const maxPrice = e.target.value; //get selected price
    //if Show All is selected
    if (maxPrice === "all") {
      //show all products
      setProductsDisplay(productList);
      //if a specific price is selected
    } else {
      //filter products by price
      setProductsDisplay(
        productList.filter(
          (prod) => prod.price.replace("$", "") < maxPrice //convert price string to number
        )
      );
    }
  };

  const handleLogout = async () => {
    Cookies.remove("jwt-authorization");
    navigate("/");
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };
  const handleEditProduct = async (targetProduct) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/edit-product/",
        targetProduct
      );
      if (response.status === 201) {
        navigate("/edit-product");
        Cookies.set("jwt-token", response.data.token);
      }
    } catch (error) {
      console.log(error.message);
    }
    setPostResponse("");
  };

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios
        .delete(`http://localhost:3000/products/${productId}`)
        .then((result) => {
          console.log(result);
          setPostResponse(
            `${result.data.productName} deleted\n with id: ${result.data.id}`
          );
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddToCart = (productId) => {
    const product = productList.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };
  /////////Renderer
  return (
    <div>
      <NavBar
        currentUser={currentUser}
        quantity={cartList.length}
        handleAddProduct={handleAddProduct}
        handleLogout={handleLogout}
      />
      {/* <div>
        <FilterForm handleFilterPrice={handleFilterPrice} />
      </div> */}
      <div className="GroceriesApp-Container">
        <FilterForm handleFilterPrice={handleFilterPrice} />
        <ProductsContainer
          //products={productList}
          products={productsDisplay} //display filtered products
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          currentUser={currentUser}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}

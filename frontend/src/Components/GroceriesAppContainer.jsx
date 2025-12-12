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
  const [productQuantity, setProductQuantity] = useState(); //State to track quantities of products
  const [cartList, setCartList] = useState([]); //State to track products in the cart
  const [productList, setProductList] = useState([]); //State to track all products
  const [postResponse, setPostResponse] = useState("");
  const [productsDisplay, setProductsDisplay] = useState([]); //New state for filtered products
  //State to track current user
  const [currentUser] = useState(() => {
    const jwtToken = Cookies.get("jwt-authorization"); //get jwt token from cookies
    if (!jwtToken) {
      //if no token, return empty string
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

  //useEffect to fetch products from the database
  useEffect(() => {
    handleProductsFromDB(); //fetch products
    if (Cookies.get("jwt-token")) {
      //if there is a jwt-token cookie
      Cookies.remove("jwt-token"); //remove it
    }
  }, [postResponse]);

  //useEffect to check if user is authorized
  useEffect(() => {
    if (!currentUser) {
      navigate("/not-authorized");
    }
  });

  ////////Handlers//////////
  //Initialize product quantities to 0
  const initialProductQuantity = (prods) =>
    prods.map((prod) => {
      return { id: prod.id, quantity: 0 };
    });

  //A handler to fetch products from the database
  const handleProductsFromDB = async () => {
    try {
      await axios.get("http://localhost:3000/products").then((result) => {
        setProductList(result.data); //Set all products
        setProductsDisplay(result.data); //Initialize filtered products to show all products
        setProductQuantity(initialProductQuantity(result.data)); //Set initial quantities to 0
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

  //Handler to log out user and clear cookies
  const handleLogout = async () => {
    Cookies.remove("jwt-authorization");
    navigate("/");
  };

  //Handler to navigate to add product page
  const handleAddProduct = () => {
    navigate("/add-product");
  };

  //Handler to navigate to edit product page
  const handleEditProduct = async (targetProduct) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/edit-product/",
        targetProduct
      );
      //If response is successful, navigate to edit product page
      if (response.status === 201) {
        navigate("/edit-product");
        Cookies.set("jwt-token", response.data.token);
      }
    } catch (error) {
      console.log(error.message);
    }
    setPostResponse("");
  };

  //Handler to add quantity to a product in either cart or product list
  const handleAddQuantity = (productId, mode) => {
    //Mode can be either 'cart' or 'product' to indicate where to add quantity
    //If mode is cart, update quantity in cartList
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
      //If mode is product, update quantity in productQuantity
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

  //Handler to remove quantity from a product in either cart or product list
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

  //Handler to delete a product from the database
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

  //Handler to add a product to the cart
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

  //Handler to remove a product from the cart
  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  //Handler to clear the cart
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

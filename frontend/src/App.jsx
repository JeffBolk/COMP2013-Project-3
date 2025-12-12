import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import products from "./data/products";
import LoginPage from "./Components/LoginPage";
import CreatePage from "./Components/CreatePage";
import PageNotFound from "./Components/PageNotFound";
import NotAuthorizedPage from "./Components/NotAuthorizedPage";
import GroceriesAppContainer from "./Components/GroceriesAppContainer";
import ProductForm from "./Components/ProductForm";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-user" element={<CreatePage />} />
          <Route
            path="/main"
            element={<GroceriesAppContainer products={products} />}
          />
          <Route path="/add-product" element={<ProductForm/>} />
          <Route path="/edit-product" element={<ProductForm/>} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      {/*<GroceriesAppContainer products={products} />*/}
    </>
  );
}

export default App;

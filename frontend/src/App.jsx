import "./App.css";
import products from "./data/products";
import GroceriesAppContainer from "./Components/GroceriesAppContainer";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element="" />
          <Route path="/create-user" element="" />
          <Route path="/main" element={<GroceriesAppContainer products={products} />}/>
          <Route path="/edit-product" element="" />
          <Route path="/add-product" element="" />
          <Route path="/not-authorized" element="" />
          <Route path="*" element="" />
        </Routes>
      </Router>
    </>
  );
}

export default App;

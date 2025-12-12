import Cookies from "js-cookie";
export default function NavBar({ quantity, handleAddProduct }) {
  return (
    <nav className="NavBar">
      <div className="NavDiv NavUser">
        <h3>Hello, {Cookies.get("user")}</h3>
      </div>
      <div className="NavDiv NavTitle">
        <h2>Groceries App 🍎</h2>
        {Cookies.get("user") == "admin" ? (
                <>
                  <button onClick={handleAddProduct} >Add product</button>
                </>
              ) : (
                <></>
              )}
      </div>
      <div className="NavDiv NavCart">
        <img
          src={
            quantity > 0
              ? "src/assets/cart-full.png"
              : "src/assets/cart-empty.png"
          }
        />
      </div>
    </nav>
  );
}

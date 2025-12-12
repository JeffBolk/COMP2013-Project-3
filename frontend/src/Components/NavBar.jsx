export default function NavBar({ currentUser, quantity, handleAddProduct, handleLogout }) {
  return (
    <nav className="NavBar">
      <div className="NavDiv NavUser">
        <h3>Hello, {currentUser}</h3>
        <button onClick={handleLogout} >Logout</button>
      </div>
      <div className="NavDiv NavTitle">
        <h2>Groceries App 🍎</h2>
        {currentUser == "admin" ? (
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

import { Link } from "react-router-dom";

//This component is displayed when a user tries to access a page that does not exist
export default function PageNotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Back to Login Page</Link>
    </div>
  );
}

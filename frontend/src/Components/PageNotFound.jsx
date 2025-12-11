import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/">Back to Login Page</Link>
    </div>
  );
}

import { Link } from "react-router-dom";

// Component to display a not authorized message
// This is used when a user tries to access a page they don't have permission for
//i.e when they are not logged in or aren't an admin
export default function NotAuthorizedPage() {
  return (
    <div>
      <h1>You are not authorized to visit this page</h1>
      <Link to="/">Back to Login Page</Link>
    </div>
  );
}

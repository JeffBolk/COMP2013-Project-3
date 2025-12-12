//This component renders a user form for login or registration

export default function UserForm({
  userFormData,
  handleOnSubmit,
  handleOnChange,
  postResponse,
  buttonLabel,
}) {
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={userFormData.username}
          onChange={handleOnChange}
        />
        <br />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={userFormData.password}
          onChange={handleOnChange}
        />
        <br />
        <button>{buttonLabel}</button>
      </form>
      <p>{postResponse}</p>
    </div>
  );
}

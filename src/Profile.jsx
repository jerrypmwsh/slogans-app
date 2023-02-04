import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return !isAuthenticated ? (
    <LoginButton></LoginButton>
  ) : (
    <LogoutButton img={user.picture} alt={user.name}></LogoutButton>
  );
};

export default Profile;

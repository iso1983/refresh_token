import React from "react";
import { SignInContainer, SignInField } from "./SignIn.styles";
import Input from "../../components/form-input/form_input.component";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../store/user/userSlice";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      // set data we get from nodejs to redux
      dispatch(updateUser(data));
      // also store the refreshToken in localstorage
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {localStorage.getItem("refreshToken") ? (
        <h1>You are already logged in</h1>
      ) : (
        <SignInContainer>
          <SignInField>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="submit" />
            </form>
          </SignInField>
        </SignInContainer>
      )}
    </>
  );
};

export default SignIn;

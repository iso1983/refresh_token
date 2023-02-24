import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { updateUser } from "../../store/user/userSlice";

//I create a new axios object,do not use the same axios instance with the one when you log in,because we will use the interceptor on the axios instance that deals with protected routes not login/register
const axiosJWT = axios.create();

function calculateTime() {
  let currentDate = new Date();
  return currentDate.getTime();
}
export function Profile() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  let [dashboardPageData, setDashboardPageData] = useState("");
  //useSelector is used to retrieve specific pieces of state from Redux store and use them in your component, the component will re-render if the selected data in the store changes
  const userSlice = useSelector((state) => state.user);

  const refreshTokenFunc = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/refresh", {
        // use the refreshToken in localstorage,remember after we sign in, we save the refreshToken in the local storage. Why don't we use the refresh token in Redux store instead? Because if you reload the page on the browser, redux store will be removed
        token: localStorage.getItem("refreshToken"),
      });

      console.log(`from refreshtoken function ${data.refreshToken}`);

      return data;
    } catch (err) {}
  };

  // Interceptor runs after we make a request using axiosJWT object in useEffect to make a request to /dashboard then interceptor,intercepts the request and updates the Authorization Header by adding a new accessToken value we get from the refreshTokenFunc function so we basically intercept the request to /dashboard and get new accessToken and update the Authorization header so we can access protected routes such as /dashboard , also update redux store for the new access token and refresh token
  axiosJWT.interceptors.request.use(
    async (config) => {
      const decodedAccessToken = jwt_decode(
        localStorage.getItem("accessToken")
      );
      //if expiration time is smaller than current time,then our accesstoken is expired so get a new one,we do not want to make unnecessary requests to the backend
      if (decodedAccessToken.exp * 1000 < calculateTime()) {
        console.log("From interceptor");

        var data = await refreshTokenFunc();
        //also update the localstorage
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("accessToken", data.accessToken);
        console.log(localStorage.getItem("refreshToken"));
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        console.log(
          `From interceptor I GOT ACCESS TOKEN ${localStorage.getItem(
            "accessToken"
          )}`
        );
        //dispatch re-renders the component,Why do i run dispatch? Because we want to update accessToken and refreshToken in redux store so if we go to /signin , we can check if the accessToken is set,you can also use localstorage
        dispatch(
          updateUser({
            ...userSlice,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );
      }
      return config;
    },
    (err) => {
      navigate("/signin");
      console.log(err);
    }
  );

  useEffect(() => {
    const fetchNewToken = async () => {
      try {
        console.log(`FROM useEffect,${localStorage.getItem("refreshToken")}`);
        const { data } = await axiosJWT.get(
          "http://localhost:5000/api/dashboard",
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );
        setDashboardPageData(data);
      } catch (err) {
        console.log(err);
        navigate("/signin");
      }
    };
    fetchNewToken();
  });

  return dashboardPageData;
}

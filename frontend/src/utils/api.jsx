import axios from "axios";

// notice we do not use await or promise of axios since we use thunk,it can deal with that.
export const getProducts = () => {
  try {
    return axios.get("http://localhost:5000/", { responseType: "json" });
  } catch (e) {
    console.log(e);
  }
};

// export const getUser = () => {
//   try {
//     return axios.get("/login", { responseType: "json" });
//   } catch (err) {
//     console.log(err);
//   }
// };

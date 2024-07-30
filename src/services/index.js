import axios from "axios";

const homeMateAPI = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 10000,
});

let Auth = {
  async login(username, password) {
    try {
      let response = await homeMateAPI.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      let user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },
  async logout() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        let response_access = homeMateAPI.delete("/auth/logout", {
          headers: {
            Authorization: `Bearer ${user["token"].trim()}`,
          },
        });
        if (user["refreshToken"]) {
          let response_refresh = homeMateAPI.delete("/auth/logout", {
            headers: {
              Authorization: `Bearer ${user["refreshToken"].trim()}`,
            },
          });
        }
        if (response_access || (response_access && response_refresh)) {
          localStorage.removeItem("user");
          return true;
        }
      } catch (error) {
        console.error("Logout failed:", error);
        return false;
      }
    }
  },
  getTokenLocalStorage() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user && user["token"]) {
      return user["token"];
    }
  },
  async getUser() {
    let _user = JSON.parse(localStorage.getItem("user"));
    if (_user) {
      try {
        let response = await homeMateAPI.post(
          "/auth/getuser",
          {},
          {
            headers: {
              Authorization: `Bearer ${_user.token.trim()}`,
            },
          },
        );
        if (response.data) {
          return _user;
        }
        localStorage.removeItem("user");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            localStorage.removeItem("user");
            if (_user.refreshToken) {
              let response = await homeMateAPI.post(
                "/auth/refresh",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${_user.refreshToken.trim()}`,
                  },
                },
              );
              let user = response.data;
              if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                return user;
              }
              localStorage.removeItem("user");
            }
          } catch (error) {
            console.error("Refreshing token failed:", error);
            localStorage.removeItem("user");
            return false;
          }
        } else {
          console.error("Failed to get user:", error);
          localStorage.removeItem("user");
          return false;
        }
      }
    }
    return false;
  },

  state: {
    get user() {
      return Auth.getUser();
    },
    get token() {
      return Auth.getTokenLocalStorage();
    },
  },
};

export { homeMateAPI, Auth };

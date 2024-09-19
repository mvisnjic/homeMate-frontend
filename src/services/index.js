import axios from "axios";
import router from '../router/index.js'

const backend_url = "http://192.168.1.4:5000"
const homeMateAPI = axios.create({
  baseURL: backend_url,
  timeout: 15000,
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
  getUserFromLocalStorage() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user && user["token"]) {
      return user;
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
    get getUserFromLocalStorage() {
      return Auth.getUserFromLocalStorage();
    }
  },
};


let Chat = {
  async getChats() {
    let user = Auth.getUserFromLocalStorage()

    if (user) {
      try {
        let response = await homeMateAPI.post(
          "/chat/getchats",
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token.trim()}`,
            },
          },
        );
        if (response) {
          return response
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push({ path: '/login' })
        }
        if (error.response && error.response.status === 404) {
          console.log('no chats found.');
          return false;
        }
        console.error("Get chats failed:", error);
        return false;
      }
    }
  },
  async getMessages(chat_id, page=0, per_page=15) {
    let user = Auth.getUserFromLocalStorage()

    if (user) {
      try {
      let response = await homeMateAPI.post(
        "/chat/getmessages",
        JSON.stringify({ chat_id, page, per_page }),
        {
          headers: {
            Authorization: `Bearer ${user.token.trim()}`,
            'Content-Type': 'application/json'
          },
        },
      );
      if (response.data.messages.length < 3 && response.data.pagination.total_pages != 1) {
        return await this.getMessages(chat_id, 0, per_page * 2)
      }
      if (response) {
        return response
      }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push({ name: 'login' });
          return false
        }
        console.error("Get message failed:", error);
        return false
      }
    }
  },

  async loadModel(model) {
    const user = Auth.getUserFromLocalStorage();

    if (model && user){
      try {
      let response = await homeMateAPI.post(
        "/chat/loadmodel",
        JSON.stringify({ model, 'keep_alive': 600}),
        {
          headers: {
            Authorization: `Bearer ${user.token.trim()}`,
            'Content-Type': 'application/json'
          },
        },
      );
      if (response) {
        return response
      }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push({ name: 'login' });
        }
        console.error("Load model failed:", error);
        return error;
      }
    }
  },
  
  async deleteChat(chat_id) {
    const user = Auth.getUserFromLocalStorage();
    console.log(user);
    if (user && chat_id){
      try {
      let response = homeMateAPI.delete("chat/delete", {
      headers: {
        Authorization: `Bearer ${user.token.trim()}`
      },
      data: {
        chat_id
      }
    });
      if (response) {
        return response
      }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push({ name: 'login' });
        }
        if (error.response && error.response.status === 404) {
          router.push('/chat');
        }
        console.error("Chat delete failed:", error);
        return error;
      }
    }
  },

  async generateResponse(message, chat_id, updateCallback, msgList) {
    const user = Auth.getUserFromLocalStorage();
    if(chat_id > 0){
      localStorage.setItem("chat_id", chat_id);
    }

    let messagesListTemp = JSON.parse(JSON.stringify(msgList));

    messagesListTemp.unshift({
      content: `I am ${user.username}, you are
                 a private home assistant that can toggle a light, create alerts, manage calendar tasks, grocery list, fridge monitoring, recipes ideas, reminders, information like news and temperature, download & play music.
                 Your name is homeMate. Behave like a normally bot, returning responses but if user wants some of functions to call then you need to respond on it like private home assistant. Do not respond only with success!`,
      role: 'system',
    });

    messagesListTemp.push({
      content: message,
      role: 'user',
    });

      try {
        const response = await fetch(`${backend_url}/chat/generate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gemma2:2b',
            user_message: message,
            chat_id: parseInt(chat_id),
            user_id: user.id,
            messages: messagesListTemp,
            stream: true,
          }),
        });
        
        if (response.status === 401) {
          router.push({ name: 'login' });
          return;
        }
        if (response.status === 413) {
          throw new Error('User message to large. Max is 1000 char')
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullResponse = '';
        let buffer = '';

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;

          if (value) {
            const chunk = decoder.decode(value);
            buffer += chunk;
            let boundary = buffer.lastIndexOf('\n');
            while (boundary !== -1) {
              const part = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 1);
              boundary = buffer.lastIndexOf('\n');

              try {
                const json = JSON.parse(part.trim());
                fullResponse += json.response;
                console.log("jssssssssson", json.response);
                if(json.error){
                  fullResponse = json.error
                }
                if (updateCallback) {
                  if(json.chat_id){
                  console.log(json.chat_id);
                  localStorage.setItem("chat_id", json.chat_id);
                  }
                  updateCallback(fullResponse);
                }
                
              } catch (e) {
                console.error('Failed to parse chunk:', e);
              }
            }
          }
        }
        return fullResponse
      } catch (error) {
        console.error('Error fetching streamed response:', error);
        throw error;
      }
    },

}

export { homeMateAPI, Auth, Chat };

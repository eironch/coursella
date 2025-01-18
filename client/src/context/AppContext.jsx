import { useState, createContext, useContext, useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const AppContext = createContext();

AppProvider.propTypes = {
  children: PropTypes.node,
};

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [apiUrl, setApiUrl] = useState(
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:8080",
  );
  const axiosApi = axios.create({
    baseURL: apiUrl + "/api",
    withCredentials: true,
  });
  const [userId, setUserId] = useState();
  const [role, setRole] = useState("student");
  const rolePathMap = {
    Admin: "/admin",
    Instructor: "/instructor",
    Coordinator: "/coordinator",
  };
  const api = {
    get: async (endpoint, { params, signal }) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const res = await axiosApi.get(endpoint, {
        params,
        signal,
        headers,
      });

      if (res.data.accessToken && accessToken !== res.data.accessToken)
        localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.userId && res.data.role) {
        setUserId(res.data.userId);
        setRole(res.data.role);
        handlePath(res.data.role)
      }

      return res;
    },
    post: async (endpoint, body, header) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { ...header?.headers, Authorization: `Bearer ${accessToken}` }
        : {};

      const res = await axiosApi.post(endpoint, body, {
        headers,
      });
      if (res.data.accessToken && accessToken !== res.data.accessToken)
        localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.userId && res.data.role) {
        setUserId(res.data.userId);
        setRole(res.data.role);
        handlePath(res.data.role)
      }

      return res;
    },
    put: async (endpoint, body, header) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { ...header?.headers, Authorization: `Bearer ${accessToken}` }
        : {};

      const res = await axiosApi.put(endpoint, body, {
        headers,
      });

      if (res.data.accessToken && accessToken !== res.data.accessToken)
        localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.userId && res.data.role) {
        setUserId(res.data.userId);
        setRole(res.data.role);
        handlePath(res.data.role)
      }
      
      return res;
    },
  };

  function handlePath(userRole) {
    if (location.pathname.startsWith("/syllabus/")) return;

    const path = rolePathMap[userRole] || "/";
    navigate(path);
  }

  function log(res) {
    if (import.meta.env.VITE_ENV === "production") return;

    console.log({ status: res.status, message: res.data.message });
  }

  function error(err) {
    if (import.meta.env.VITE_ENV === "production") return;

    if (err.name === "CanceledError") {
      console.log(err);
      return;
    }

    console.error({
      status: err.response.status,
      error: err.response.data.error,
    });
  }

  function incrementProgramYearSem(value, setValue) {
    if (value.year === 4 && value.sem === 2) return;

    setValue((prev) => {
      let { year, sem } = prev;

      if (year === 4 && sem === 2) return { year, sem };

      if (sem === 1) {
        sem = 2;
      } else {
        year += 1;
        sem = 1;
      }

      return { year, sem };
    });
  }

  function decrementProgramYearSem(value, setValue) {
    if (value.year === 1 && value.sem === 1) return;

    setValue((prev) => {
      let { year, sem } = prev;

      if (sem === 1) {
        year -= 1;
        sem = 2;
      } else {
        sem = 1;
      }

      return { year, sem };
    });
  }

  async function logOut() {
    try {
      const res = await axiosApi.post("/auth/log-out");
      log(res);

      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (err) {
      error(err);
    }
  }

  useLayoutEffect(() => {
    async function validateAccess() {
      try {
        const res = await api.post("/auth/validate-access");
        log(res)
      } catch (err) {
        error(err);

        setUserId("");
        navigate("/");
      }
    }
    if (!location.pathname.startsWith("/syllabus/")) validateAccess();
  }, []);

  return (
    <AppContext.Provider
      value={{
        navigate,
        apiUrl,
        setApiUrl,
        api,
        userId,
        role,
        setUserId,
        log,
        error,
        logOut,
        incrementProgramYearSem,
        decrementProgramYearSem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

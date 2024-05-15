import { useApiStore } from "@api/apiStore";
import { session } from "@api/session";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider, Authenticated, Refine } from "@refinedev/core";
import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  RefineThemes,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { PostCreate, PostEdit, PostList } from "../src/pages/posts";
import Login from "./pages/login";
import { sessionRefresh } from "@api/session-refresh";

/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "qzcurious@gmail.com",
  password: "1234",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ email, password, rememberMe }) => {
      const formData = new FormData();
      formData.append("account", email);
      formData.append("password", password);
      const res = await session(formData);

      if (res.parseError) {
        return {
          success: false,
          error: {
            message: "Validation error",
            name: "Validation error",
          },
        };
      }

      if (res.error) {
        return {
          success: false,
          error: {
            message: "Login failed",
            name: "Invalid email or password",
          },
        };
      }

      useApiStore.getState().setRemember(rememberMe ? email : null);

      return {
        success: true,
        redirectTo: "/",
      };
    },
    register: async (params) => {
      if (params.email === authCredentials.email && params.password) {
        localStorage.setItem("email", params.email);
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    },
    updatePassword: async (params) => {
      if (params.password === authCredentials.password) {
        //we can update password here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Invalid password",
        },
      };
    },
    forgotPassword: async (params) => {
      if (params.email === authCredentials.email) {
        //we can send email with reset password link here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Forgot password failed",
          name: "Invalid email",
        },
      };
    },
    logout: async () => {
      useApiStore.getState().clearLogin();
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return { error };
    },
    check: async () => {
      const failed = {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
      const jwt = useApiStore.getState().jwt;
      if (!jwt) {
        return failed;
      }

      const refreshToken = useApiStore.getState().refreshToken;
      if (jwt.exp * 1000 < Date.now() && refreshToken) {
        const formData = new FormData();
        formData.append("refreshToken", refreshToken);
        const res = await sessionRefresh(formData);
        if (res.parseError) {
          throw Error("auth check parse error");
        }
        if (res.error) {
          return failed;
        }
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => ["admin"],
    getIdentity: async () => ({
      id: 1,
      name: "Jane Doe",
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    }),
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={RefineThemes.Blue}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "posts",
                list: "/posts",
                edit: "/posts/edit/:id",
                create: "/posts/create",
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="posts" />}
                />

                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      providers={[
                        {
                          name: "google",
                          label: "Sign in with Google",
                          icon: (
                            <GoogleIcon
                              style={{
                                fontSize: 24,
                              }}
                            />
                          ),
                        },
                        {
                          name: "github",
                          label: "Sign in with GitHub",
                          icon: (
                            <GitHubIcon
                              style={{
                                fontSize: 24,
                              }}
                            />
                          ),
                        },
                      ]}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineSnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

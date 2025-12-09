import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=5028a3eb"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=5028a3eb"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=5028a3eb"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"];
import "/src/index.css?t=1765285245158";
import App from "/src/App.jsx";
import { RouterProvider } from "/node_modules/.vite/deps/react-router_dom.js?v=5028a3eb";
import { router } from "/src/Routes/Router.jsx?t=1765285245158";
import { ThemeProvider } from "/src/Theme/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=5028a3eb";
import AuthProvider from "/src/Contexts/AuthProvider.jsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(ThemeProvider, { children: /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(RouterProvider, { router, children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 20,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 19,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 18,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 17,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 16,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "D:/web ph/back-End/LoanLink/loan-link-client/src/main.jsx",
    lineNumber: 15,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBbUJZO0FBbkJaLFNBQVNBLGtCQUFrQjtBQUMzQixTQUFTQyxrQkFBa0I7QUFDM0IsT0FBTztBQUNQLE9BQU9DLFNBQVM7QUFDaEIsU0FBU0Msc0JBQXNCO0FBQy9CLFNBQVNDLGNBQWM7QUFDdkIsU0FBU0MscUJBQXFCO0FBQzlCLFNBQVNDLGFBQWFDLDJCQUEyQjtBQUNqRCxPQUFPQyxrQkFBa0I7QUFHekIsTUFBTUMsY0FBYyxJQUFJSCxZQUFZO0FBRXBDTCxXQUFXUyxTQUFTQyxlQUFlLE1BQU0sQ0FBQyxFQUFFQztBQUFBQSxFQUMxQyx1QkFBQyxjQUNDLGlDQUFDLGlCQUNDLGlDQUFDLHVCQUFvQixRQUFRSCxhQUMzQixpQ0FBQyxnQkFDQyxpQ0FBQyxrQkFBZSxRQUNkLGlDQUFDLFNBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFJLEtBRE47QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUVBLEtBSEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUlBLEtBTEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQU1BLEtBUEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQVFBLEtBVEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQVVBO0FBQ0YiLCJuYW1lcyI6WyJTdHJpY3RNb2RlIiwiY3JlYXRlUm9vdCIsIkFwcCIsIlJvdXRlclByb3ZpZGVyIiwicm91dGVyIiwiVGhlbWVQcm92aWRlciIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsIkF1dGhQcm92aWRlciIsInF1ZXJ5Q2xpZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJtYWluLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdHJpY3RNb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnO1xuaW1wb3J0ICcuL2luZGV4LmNzcyc7XG5pbXBvcnQgQXBwIGZyb20gJy4vQXBwLmpzeCc7XG5pbXBvcnQgeyBSb3V0ZXJQcm92aWRlciB9IGZyb20gJ3JlYWN0LXJvdXRlci9kb20nO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSAnLi9Sb3V0ZXMvUm91dGVyLmpzeCc7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi9UaGVtZS9UaGVtZUNvbnRleHQuanN4JztcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCBBdXRoUHJvdmlkZXIgZnJvbSAnLi9Db250ZXh0cy9BdXRoUHJvdmlkZXIuanN4JztcblxuLy8gMe+4j+KDoyBDcmVhdGUgYSBRdWVyeUNsaWVudCBpbnN0YW5jZVxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKTtcblxuY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoXG4gIDxTdHJpY3RNb2RlPlxuICAgIDxUaGVtZVByb3ZpZGVyPlxuICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICAgIDxBdXRoUHJvdmlkZXI+XG4gICAgICAgICAgPFJvdXRlclByb3ZpZGVyIHJvdXRlcj17cm91dGVyfT5cbiAgICAgICAgICAgIDxBcHAgLz5cbiAgICAgICAgICA8L1JvdXRlclByb3ZpZGVyPlxuICAgICAgICA8L0F1dGhQcm92aWRlcj5cbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgICA8L1RoZW1lUHJvdmlkZXI+XG4gIDwvU3RyaWN0TW9kZT5cbik7XG4iXSwiZmlsZSI6IkQ6L3dlYiBwaC9iYWNrLUVuZC9Mb2FuTGluay9sb2FuLWxpbmstY2xpZW50L3NyYy9tYWluLmpzeCJ9
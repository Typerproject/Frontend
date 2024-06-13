import { RouterProvider } from "react-router-dom";
import MainRouter from "./main-router";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
// import { persistStore } from "redux-persist";

export const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      {/* <RouterProvider router={MainRouter}></RouterProvider> */}
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={MainRouter} />
      </PersistGate>
    </Provider>
  );
}

export default App;

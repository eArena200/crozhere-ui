"use client";

import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={getLoadingElement()} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

function getLoadingElement(){
  return (
    <div>
      LOADING...
    </div>
  );
}

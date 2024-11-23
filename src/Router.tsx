// import React from "react";
// import ReactDOM from "react-dom/client";
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   from,
//   HttpLink,
// } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// Routes
import Home from "./routes/Home";
import Data from "./routes/Data";
// import Survey from "./routes/Survey";
import Analytics from "./routes/Analytics";
import Area from "./routes/Area";
// Styles
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Apollo Client Setup

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
          children={[
            <Route index={true} path="data" element={<Data />} />,
            <Route path="survey" element={<Data />} />,
          ]}
        />
        <Route
          path="/analytics"
          element={<Analytics />}
          children={[<Route path="area/:municipalID" element={<Area />} />]}
        />
        ,
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

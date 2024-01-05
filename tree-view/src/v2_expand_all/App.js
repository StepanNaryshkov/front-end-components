import React, { useEffect, useState } from "react";
import { fetchData } from "../data";
import TreeView from "./tree-view";
import { TreeProvider, useTreeState } from "./TreeContext";

function MainApp() {
  const { state, dispatch } = useTreeState();
  console.log("state", state);
  useEffect(() => {
    fetchData().then((data) => {
      dispatch({ type: "INIT_DATA", data });
    });
  }, []);

  return (
    <div className="App">
      <input type="text" placeholder="Search..." />
      <div>
        <button onClick={() => dispatch({ type: "EXPAND_ALL" })}>
          Expand All
        </button>
        <button onClick={() => dispatch({ type: "COLLAPSE_ALL" })}>
          Collapse All
        </button>
      </div>

      <TreeView data={state} />
    </div>
  );
}

export default function App() {
  return (
    <TreeProvider>
      <MainApp />
    </TreeProvider>
  );
}

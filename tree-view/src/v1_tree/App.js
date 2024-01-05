import React, { useEffect, useState } from "react";
import { fetchData } from "../data";
import TreeView from "./tree-view";

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

  return (
    <div className="App">
      <input type="text" placeholder="Search..." />
      <TreeView data={data} />
    </div>
  );
}

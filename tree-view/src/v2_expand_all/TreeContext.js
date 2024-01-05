import React, { createContext, useContext, useReducer } from "react";

const TreeStateContext = createContext();

const toggleNode = (nodes, id, expanded) => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, isExpanded: expanded };
    }
    if (node.children) {
      return { ...node, children: toggleNode(node.children, id, expanded) };
    }
    return node;
  });
};

const updateAllNodes = (nodes, isExpanded) => {
  return nodes.map((node) => {
    if (node.children) {
      return {
        ...node,
        isExpanded,
        children: updateAllNodes(node.children, isExpanded)
      };
    }
    return { ...node, isExpanded };
  });
};

const treeReducer = (state, action) => {
  console.log("ttt", action);
  switch (action.type) {
    case "INIT_DATA":
      return action.data;
    case "TOGGLE_NODE":
      return toggleNode(state, action.id, action.isExpanded);
    case "EXPAND_ALL":
      return updateAllNodes(state, true);
    case "COLLAPSE_ALL":
      return updateAllNodes(state, false);
    default:
      return state;
  }
};

export const TreeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(treeReducer, []); // Default state set as an empty array

  return (
    <TreeStateContext.Provider value={{ state, dispatch }}>
      {children}
    </TreeStateContext.Provider>
  );
};

export const useTreeState = () => {
  const context = useContext(TreeStateContext);
  return context;
};

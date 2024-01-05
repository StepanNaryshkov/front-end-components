import React, { createContext, useContext, useReducer, useState } from "react";

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

const searchNodesAndUpdateHighlight = (nodes, query) => {
  nodes.forEach((node) => {
    let shouldHighlight = query.length
      ? node.name.toLowerCase().includes(query.toLowerCase())
      : false;

    node.isHighlight = shouldHighlight;

    if (node.children) {
      searchNodesAndUpdateHighlight(node.children, query);
      if (node.children.some((child) => child.isHighlight)) {
        node.isHighlight = true;
      }
    }
  });

  return nodes;
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
    case "SEARCH":
      return searchNodesAndUpdateHighlight(state, action.query);
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

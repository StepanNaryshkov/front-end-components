import React, { useState } from "react";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNode = () => setIsOpen(!isOpen);

  return (
    <div className="tree-node">
      {node.children && (
        <button onClick={toggleNode} className="toggle-icon">
          {isOpen ? "⮝" : "⮟"}
        </button>
      )}
      <span>{node.name}</span>
      {isOpen && <TreeView data={node?.children} />}
    </div>
  );
};

const TreeView = ({ data }) => {
  return (
    <div className="tree-view">
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default TreeView;

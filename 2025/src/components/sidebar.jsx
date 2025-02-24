import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import "./sidebar.css";

export const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="header">Complex</div>
      <AceEditor
        width="500px"
        height="50vh"
        className="code-editor"
        mode="javascript"
        theme="monokai"
        value={props.code}
        onChange={props.onCodeChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
      <div className="actions">
        <button
          className="action-btn"
          onClick={() => props.onBuild(props.code)}
        >
          Build
        </button>
      </div>
    </div>
  );
};

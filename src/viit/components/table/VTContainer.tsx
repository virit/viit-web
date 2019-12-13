import React from "react";
import styles from './style.less';

const VTContainer:React.FC<any> = ({ children }) => (
  <div className={styles.tableList}>
    { children }
  </div>
);
export default VTContainer;

import React from "react";
import styles from './style.less';

const TableContainer:React.FC<any> = ({ children }) => (
  <div className={styles.submitButtons}>
    { children }
  </div>
);
export default TableContainer;

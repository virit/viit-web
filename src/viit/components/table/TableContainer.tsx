import React from "react";
import styles from './table.less';

const TableContainer:React.FC<any> = ({ children }) => (
  <div className={styles.standardTable}>
    { children }
  </div>
);
export default TableContainer;

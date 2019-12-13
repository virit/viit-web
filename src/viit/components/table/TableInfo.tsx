import React from "react";
import styles from './table.less';

const TableInfo:React.FC<any> = ({ children }) => (
  <div className={styles.tableAlert}>
    { children }
  </div>
);
export default TableInfo;

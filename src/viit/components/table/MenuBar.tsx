import React from "react";
import styles from './style.less';

const MenuBar:React.FC<any> = ({ children }) => (
  <div className={styles.tableListOperator}>
    { children }
  </div>
);
export default MenuBar;

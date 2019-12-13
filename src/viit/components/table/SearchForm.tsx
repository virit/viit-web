import React from "react";
import styles from './style.less';

const SearchForm:React.FC<any> = ({ children }) => (
  <div className={styles.tableListForm}>
    { children }
  </div>
);
export default SearchForm;

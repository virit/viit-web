import * as React from "react";
import {useEffect, useState} from "react";

interface CheckProps {
  children: any;
}

const AuthorityContainer:React.FC<CheckProps> = ({ children }) => {

  const [showChildren, setShowChildren] = useState(true);
  const ref = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (ref.current === undefined) {
      return;
    }
    const innerText = ref.current ? ref.current.innerText : undefined;
    setShowChildren(innerText !== '' && innerText !== undefined);
  }, [ref]);
  return <>{showChildren ? <div ref={ref}>{ children }</div> : '-'}</>;
};
export default AuthorityContainer;

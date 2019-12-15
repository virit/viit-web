import * as React from "react";
import {connect} from "dva";

interface CheckProps {
  withAuthority?: string[] | string;
  user: {
    currentUser: {
      grantedAuthorities: string[];
    };
  };
}

const AuthorityChecker:React.FC<CheckProps> = ({withAuthority, children, user }) => {

  const authorities = user.currentUser.grantedAuthorities;
  const normalizeWithAuthorities = withAuthority === undefined ? []
    : Array.isArray(withAuthority) ? withAuthority : [withAuthority];

  const checkFunction = (total: string[], input: string[]):boolean => {
    for (let index in input) {
      const item = input[index];
      if (total.indexOf(item) === -1) return false;
    }
    return true;
  };

  if (authorities.indexOf('ROLE_super') !== -1 || checkFunction(authorities, normalizeWithAuthorities)) {
    return <>{children}</>;
  }
  return <></>;
};
interface StateType {
  user: any
}
export default connect((state:StateType) => {
  return state;
})(AuthorityChecker);

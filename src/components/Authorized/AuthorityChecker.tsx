import * as React from "react";
import {connect} from "dva";

interface CheckProps {
  withAuthority?: string;
  user: {
    currentUser: {
      grantedAuthorities: string[];
    };
  };
}

const AuthorityChecker:React.FC<CheckProps> = ({ children, withAuthority, user }) => {

  const { grantedAuthorities } = user.currentUser;
  if (withAuthority !== undefined) {
    if (grantedAuthorities.indexOf(withAuthority) !== -1 || grantedAuthorities.indexOf('ROLE_super') !== -1) {
      return <>{children}</>;
    }
  }
  return <></>;
};
interface StateType {
  user: any
}
export default connect((state:StateType) => {
  console.log(state);
  return state;
})(AuthorityChecker);

import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import memories from '../../images/memories.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    localStorage.clear()
    history.push('/auth');
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/sales" className={classes.heading} variant="h2" align="center">Sales</Typography>
        <img className={classes.image} src={memories} alt="icon" height="60" />
      </div>
      <Toolbar className={classes.toolbar}>
        {user?.result.role === "admin" ? (
          <div  className={classes.profile}>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button component={Link} to="/products" variant="contained" color="primary">Products</Button>
            <Button style={{margin: "0 10px 0 10px"}} component={Link} to="/users" variant="contained" color="primary">Users</Button>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : user?.result.state === "authorized" ? (
          <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

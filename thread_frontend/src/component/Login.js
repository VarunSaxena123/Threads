import React, { useRef, useState, useEffect, useContext } from 'react';
import { Switch, Route, NavLink, Link, useHistory, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import AuthContext from '../context/Authprovi';
const LOGIN_URL = 'http://192.168.23.204:3000/users/login';

function Login() {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['userCookie']);

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserCookie = () => {
    const userCookie = cookies.userCookie;
    if (userCookie) {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    userRef.current?.focus();
    checkUserCookie();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ userName: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser('');
      setPwd('');
      setSuccess(true);

      // Set cookie value
      const userCookie = response.data;
      setCookie('userCookie', userCookie, { path: '/' });

      history.push('/ShopPage'); // Redirect to /ShopPage
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  const handleSignUp = () => {
    history.push('/signup');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #c33764, #1d2671)',
      }}
    >
      <div
        style={{
          width: '400px',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '5px',
        }}
      >
        <h2 style={{ marginLeft: '120px' }}>Threads</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{ fontWeight: 'bold' }}>
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <Link
              to="/signup"
              style={{ color: 'black', textDecoration: 'none', marginLeft: '275px' }}
            >
              Sign Up
            </Link>
          </div>
          <button
            type="submit"
            className="login-button"
            style={{
              background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>
        {errMsg && (
          <p
            className="error-message"
            ref={errRef}
            style={{ marginTop: '10px', color: 'red' }}
          >
            {errMsg}
          </p>
        )}
      </div>
      <Switch>
        {success && <Redirect exact from="/" to="/ShopPage" />}
      </Switch>
    </div>
  );
}

export default Login;
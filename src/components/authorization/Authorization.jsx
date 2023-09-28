import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { authorizationRequest } from '../../api/companyRequest';
import { Input } from '../input';

import { FiveS } from '../../assets/svg/SVGcomponent';
import logo from '../../assets/svg/icon.svg';

import './Authorization.scss';

export const Authorization = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [correctEmail, setCorrectEmail] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [errorResponse, setErrorResponse] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [, setCookie] = useCookies(['token']);

  useEffect(() => {
    if (password.length < 20) {
      setCorrectPassword(true);
    } else {
      setCorrectPassword(false);
    }
  }, [password]);

  useEffect(() => {
    if (email.length < 25) {
      setCorrectEmail(true);
    } else {
      setCorrectEmail(false);
    }
  }, [email]);

  const post = () => {
    if (password.length > 0) {
      authorizationRequest(window.location.hostname, email, password)
        .then((response) => {
          if (response.status === 200 && response.data.access) {
            setCookie('token', `JWT ${response.data.access}`, { path: '/' });
          }
          if (!response.data.access) {
            setErrorResponse('Incorrect email or password. Please, try again.');
          }
        })
        .catch((error) => {
          setErrorResponse(error.message);
        });
    } else {
      setErrorPassword(true);
    }
  };

  const pressEnter = (event) => {
    if (event.key === 'Enter' && correctEmail && correctPassword) {
      post();
    }
  };

  return (
    <div className="authorization">
      <FiveS className="authorization__logo" />
      {/* <img src={logo} alt="logo" className="authorization__logo" /> */}
      <h2 className="authorization__title">Sign in to 5ControlS</h2>
      <div className="authorization__container">
        <label>Username</label>
        <Input
          type="text"
          placeholder="Enter Username"
          className="authorization__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* {!correctEmail && <span className='authorization__error'>Email isn't correct!</span>} */}
        <label>Password</label>
        <Input
          type="password"
          className="authorization__input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorPassword(false);
          }}
          onKeyDown={(e) => pressEnter(e)}
          showEye={true}
        />
        {errorResponse && (
          <span className="authorization__error_response">
            Incorrect email or password. Please, try again.
          </span>
        )}
        {errorPassword && (
          <span className="authorization__error_password">This field is required</span>
        )}
        <button className={'authorization__button'} onClick={post}>
          Log In
        </button>
      </div>
    </div>
  );
};

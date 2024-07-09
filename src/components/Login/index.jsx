import $ from './index.module.css'
import shiba from '../../assets/cute-shiba-inu-face.svg'

const Login = () => {

  return (
    <div className={$.container}>
      <div className={$.box}>
        <img src={shiba} />
        <input type="text" value="Adam Sandler"/>
        <input type="password" value="password" />
        <button type="button">Sign In</button>
      </div>
    </div>
  );
};

export default Login;
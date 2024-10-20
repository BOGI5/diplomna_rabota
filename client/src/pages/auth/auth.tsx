import { useState } from 'react';
import environment from '../../environment';

const AuthPage = () => {
  const onGoogleLogin = () => {
    window.location.href = `${environment.apiUrl}/auth/google`;
  };
  const [replaceWithSvg, setReplaceWithSvg] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 750);
  const [signIn, setSignIn] = useState(false);
  window.addEventListener('resize', () => {
    setIsSmallScreen(window.innerWidth < 750);
    setReplaceWithSvg(window.innerWidth < 245);
    }
  );

  return (
    <>
      <div className={`position-absolute top-50 start-50 translate-middle border h-auto container ${isSmallScreen ? "w-75" : "w-auto"}`}>
        <form action="post" className='border-bottom border-black border-2 mx-2 h-auto'>
          {signIn ? (
            <div className='my-2 w-auto d-flex justify-content-between'>
            <input type="text" name="firstName" id="1" placeholder='First Name' className='w-50 me-1' required />
            <input type="text" name="lastName" id="2" placeholder='Last Name' className='w-50 ms-1' required />
            </div>) : ""}
          <input type="email" name="email" placeholder='Email' id="3" className='d-block my-2 w-100' required/>
          <input type="password" name="password" placeholder='Password' className='d-block my-2 w-100' id="4" required />
          <div className="d-flex justify-content-center my-2">
            <button className='btn btn-outline-success me-1 w-auto' type='submit'>
              {replaceWithSvg ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>
              ) : <>{signIn ? "Sign in" : "Log in"}</>}
            </button>
            <button className='btn btn-outline-danger mx-1 w-auto' type='reset'>
              {replaceWithSvg ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
              </svg>
              ) : 'Reset'}
            </button>
            <button className="btn btn-outline-warning ms-1 w-auto" type='reset' onClick={() => {
              setSignIn(!signIn);
            }}>
              {signIn ? 'Already have an account?' : "Don't have an account?"}
            </button>
          </div>
        </form>
        <button type="button" className="btn btn-outline-primary btn-lg top-100 start-50 translate-middle-x position-relative my-3" onClick={onGoogleLogin}> 
          { replaceWithSvg ? "": 'Sign in with '}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default AuthPage;
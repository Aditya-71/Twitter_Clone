import React, { useEffect } from 'react'
import {  useRecoilValue } from 'recoil'
import authScreenAtom from '../../atoms/authAtom.js'
import LoginCard from '../component/LoginCard';
import SignupCard from '../component/SignupCard';

function AuthPage() {
    const authScreenState = useRecoilValue(authScreenAtom);
    console.log(authScreenState);
  return (
    <>
       {authScreenState === "login" ? <LoginCard/> : <SignupCard/>}
    </>
  )
}

export default AuthPage
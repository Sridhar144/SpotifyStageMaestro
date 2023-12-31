import React, {Component} from 'react'
// import './Login.css'
export default class Login extends Component{
  constructor(props){
    super(props);
  }
    render(){
      return (
<div>


    <div className='login_container'>
    <div className='login_header'>
  <img className='login_img' src='https://images.collegedunia.com/public/college_data/images/logos/16336900566237748820344441900178615267475362148777984n.png' alt=''/>
  <span className='logo_description'>CAMS</span>
  <span className='logodesc'>College Attendence Monitoring System</span>
</div>
        <h1 className='container_title'>Sign In</h1>
        <form>
            <h5 className='email'>Username</h5>
            <input type='text'   />

            <h5 className='password'>Password</h5>
            <input type='password'   />


            <button className='Signin_btn' >
                Sign In
            </button>
        </form>
        <p>By continuing, you agree to College's Conditions of Use and Privacy Notice </p>
    </div>
</div>
  )}
}
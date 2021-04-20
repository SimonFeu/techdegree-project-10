import React from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from './Context';


//Header Component
const Header = () => {

    return(
        <Consumer>
            {context => {
                /**
                 If a user is logged in the first Link shows the welcome message with the user name and the second link shows the signout link.
                 If user is logged out the first link shows the singup link and the second the signin link.
                 */
                let signupText = (context.username.length > 0) ? `Welcome, ${context.username}` : "Sign Up";
                let signupLink = (context.username.length > 0) ? "" : "/signup";
                let signInOutText = (context.username.length > 0) ? "Sign Out" : "Sign In";
                let signInOutLink = (context.username.length > 0) ? "/signout" : "/signin";
                return(
                    <header>
                        <div className="wrap header--flex">
                            <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                            <nav>
                                <ul className="header--signedout">
                                    <li><Link to={signupLink}>{signupText}</Link></li>
                                    <li><Link to={signInOutLink}>{signInOutText}</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                );
            }}
        </Consumer>
    );
}



export default Header;
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from './Context';
import ValidationMessage from './ValidationMessage';

class UserSignIn extends Component {
    constructor() {
        super();
        this.state = {
          emailAddress: "",
          password:""
        };
      } 

      /* --------------------------------------
                     handleChange 
         --------------------------------------
         This function is used to receive the changes in the input field of the form.
         If a user types data into a form input field the values are saved via setState.
      */
      handleChange = (event) => {
        let targetName = event.target.name;
        if(targetName === 'emailAddress') {
            this.setState({ emailAddress: event.target.value });
        } else if (targetName === 'password'){
            this.setState({ password: event.target.value });
        } 
      }
      
  render(){
    return(    
        <Consumer>
            {/* On form submit the signIn function is called.
                The function receives the values from the variables "this.state.emailAddress" and "this.state.password".
                As we use "props.history" within the provider for redirects we also pass "this.props".
            */}
            {context => {
                const formSubmit = (event) => {
                    event.preventDefault();
                    context.actions.signIn(this.state.emailAddress,this.state.password,this.props);
                }
                return(
                    <main>
                        <div className="form--centered">
                            <h2>Sign In</h2>
                             {/* Component "ValidationMessage" gets renderd if a validation error occurs */}
                            {
                                        (context.errorMsg.length>0) ?
                                            <ValidationMessage errorMsg={context.errorMsg}/>
                                        : ''
                                    }
                            <form onSubmit={formSubmit}>
                                <label htmlFor="emailAddress">Email Address</label>
                                <input 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    type="email" 
                                    value={this.state.emailAddress} 
                                    onChange={this.handleChange}
                                />
                                <label htmlFor="password">Password</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    value={this.state.password} 
                                    onChange={this.handleChange}
                                />
                                <button className="button" type="submit">Sign In</button>
                                <Link className="button button-secondary" to="/">Cancel</Link>
                            </form>
                            <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
                            
                        </div>
                    </main>
                );
            }}
        </Consumer>

    );
    }
} 

export default UserSignIn;



   
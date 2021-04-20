import React, {Component} from 'react';

//Component for displaying validation Errors
class ValidationMessage extends Component {
  render(){
    return(
        <div className="validation--errors">
            <h3>Validation Error:</h3>
            <ul>
                {this.props.errorMsg.map((err,index) =>  (<li key={index.toString()}>{err}</li>))}
            </ul>
        </div> 
    );
  }
} 

export default ValidationMessage;


   


 
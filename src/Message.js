import React from 'react';
import usericon from './images/user.png';
import boticon from './images/gpt.jpg';
import './Message.css';
import { domToReact } from 'html-react-parser';
import parse from 'html-react-parser';

const Message = (props) => {

    const options = {
        replace: (domNode) => {
          if (domNode.name === "pre") {
            return (
              <pre style={{ backgroundColor: "gray", padding: "10px", width:'80%' }}>
                {domToReact(domNode.children, options)}
              </pre>
            );
          } else {
            return null;
          }
        },
      };    

    let sender = props.sender;
    let message = props.text;
    if(props.sender === 'user'){
        return (
            <div className="message user">
                <div className="iconSpace">
                    <img src={usericon} alt="User Icon" style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '10px'
                    }}/>
                </div>
                <div className='messageSpace'>{parse(message, options)}</div>
            </div>
        )
    }
    else{
        return (
        <div className="message bot">
            <div className="iconSpace">
                <img src={boticon} alt="Bot Icon" style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px'
                }}/>
            </div>
            <div className='messageSpace'>{parse(message, options)}</div>
        </div>
        )
    }
}

export default Message;
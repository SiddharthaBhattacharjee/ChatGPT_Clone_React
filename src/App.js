import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import gptIcon from './images/gpt.jpg';
import Message from './Message.js';
import { Configuration, OpenAIApi } from "openai"




function App() {

  const openai = new OpenAIApi(new Configuration({ apikey: process.env.REACT_APP_API_KEY }));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const onSend = async () => {
    setMessages([...messages, { role: 'user', content: text }]);
    setText('');
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content:  text }]
    }).then(
      res => {
        console.log(res.data.choices[0].message.content);
        setMessages([...messages, { role: 'assistant', content: res.data.choices[0].message.content }]);
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setMessages([...messages, { role: "user", content: text }]);
      setText('');
      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: 'user', content: text}]
      }).then(
        res => {
          console.log(res.data.choices[0].message.content);
          setMessages([...messages, { role: 'assistant', content: res.data.choices[0].message.content }]);
        }
      ).catch(
        err => {
          console.log(err);
        }
      )
    }
  };

  return (
    <div className="App">
      <div className="header">
        <img src={gptIcon} alt="GPT Icon" style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          marginRight: '10px'
        }} />
        <h1>ChatGPT Clone</h1>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} sender={message.role} text={message.content} />
        ))}
      </div>
      <div className="input">
        <input type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="form-control"
        />
        <button onClick={onSend} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}

export default App;

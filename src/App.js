import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import gptIcon from './images/gpt.jpg';
import Message from './Message.js';
import { Configuration, OpenAIApi } from "openai"
import axios from 'axios';


function App() {

  const openai = new OpenAIApi(new Configuration({ apikey: process.env.REACT_APP_API_KEY }));

  const [Allmessages, setAllMessages] = useState([]);
  const [text, setText] = useState('');

  function getChatCompletion(usermsg) {

    let data = {
      model: "gpt-3.5-turbo",
      messages: [...Allmessages,{ role: "user", content: text }]
    }

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        'User-Agent': 'My User Agent'
      }
    }

    axios.post('https://api.openai.com/v1/chat/completions', data, config).then(
      res => {
        console.log(res.data.choices[0].message.content);
        let op = res.data.choices[0].message.content;
        const hasCodeBlock = op.includes("```");
        if (hasCodeBlock) {
          op = op.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
        }
        op = op ;
        setAllMessages(Allmessages.concat([usermsg,{ role: 'assistant', content: op }]));
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  const printMessages = () => {
    console.log(Allmessages);
  }

  useEffect(() => {
    printMessages();
  }, [Allmessages]);

  const onSend = async () => {
    setAllMessages([...Allmessages, { role: 'user', content: text }]);
    setText('');
    setTimeout(() => {
      getChatCompletion({ role: 'user', content: text });
    }, 1000);
  }

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setAllMessages([...Allmessages, { role: 'user', content: text }]);
      setText('');
      setTimeout(() => {
        getChatCompletion({ role: 'user', content: text });
      }, 1000);
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
        {Allmessages.map((message, index) => (
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

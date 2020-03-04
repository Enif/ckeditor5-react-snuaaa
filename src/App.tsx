import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './Editor';
import Editor5 from './Editor5';

function App() {

  const [text, setText] = useState('');

  return (
    <div className="App">
      <Editor5
        text={text}
        setText={setText}
        server_url="http://192.168.123.100:8080/" />
    </div>
  );
}

export default App;

import React from 'react';
import '../App.css';

function Button({ text, onClick }) {
  return (
    <button className="conteiner__button" onClick={onClick}>
        {text}
    </button>
  );
}

export default Button;

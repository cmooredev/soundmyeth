import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

interface FormProps {
  onSubmit: (inputValue: string) => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  animation: ${fadeIn} 1.2s ease-in-out;
`;

const FadingOutDiv = styled(CenteredDiv)`
  animation: ${fadeOut} 2s ease-in-out;
`;

export const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsFadingOut(true);
    setTimeout(() => onSubmit(inputValue), 1000); // delay to match animation duration
  };

  const Div = isFadingOut ? FadingOutDiv : CenteredDiv;

  return (
    <Div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </Div>
  );
};

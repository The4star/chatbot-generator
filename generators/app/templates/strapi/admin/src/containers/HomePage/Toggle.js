import React from 'react'
import styled from 'styled-components';
const ToggleContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`
const ToggleButton = styled.div`
  border: 1px solid black;
  cursor: pointer;
`

const ToggleInfoArea = styled.div`
  background: radial-gradient(circle, rgba(233,231,231,1) 0%, rgba(217,224,226,1) 100%);
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  padding: 20px;
`

const Title = styled.h3`
  margin: 10px;
`

const HandleToggle = (id) => {
  const toggleToHandle = document.getElementById(id);
  if (toggleToHandle.style.display === "none") {
    console.log("here");
    toggleToHandle.style.display = "block"
  } else {
    toggleToHandle.style.display = "none";
  }
}

const Toggle = ({ title, children }) => {
  const toggleID = `info-${title}`
  return (
    <ToggleContainer className="toggle">
      <ToggleButton onClick={() => HandleToggle(toggleID)} className="toggle__button">
        <Title>{title}</Title>
      </ToggleButton>
      <ToggleInfoArea style={{ display: 'none' }} id={toggleID} className="toggle__info">
        {children}
      </ToggleInfoArea>
    </ToggleContainer>
  )
}

export default Toggle

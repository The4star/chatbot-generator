import styled from 'styled-components';
const Button = styled.button`
  border-radius: 5px;
  background-color: #037DFE;
  padding: 5px;
  color: white;
  margin: 10px 0px;
`
const NotificationArea = styled.div`
  position: fixed;
  left: 270px;
`

const GoodNotification = styled.div`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #03fe81;
  padding: 5px;
  color: black;
  margin: 10px 0px;
`

const BadNotification = styled.div`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #fe0303;
  padding: 5px;
  color: black;
  margin: 10px 0px;
`

export {
  Button,
  NotificationArea,
  GoodNotification,
  BadNotification
}
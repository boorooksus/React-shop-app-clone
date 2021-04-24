/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Badge } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/product/upload">Upload</a>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingTop: 10 }}>
          {/* 일단은 뱃지의 숫자를 5로 설정. 
          나중에 수정 예정... */}
          <Badge count={5}>
            <a href="/user/cart" className="head-example" style={{ marginRight: -2, color: '#667777' }} >
              Cart
              {/* <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }} /> */}
            </a>
          </Badge>
        </Menu.Item>

      </Menu>
    )
  }
}

export default withRouter(RightMenu);


import React , { Component } from 'react'
import { Link } from 'react-router'
import './header.sass'
import { rootPath } from '../../config'

class Header extends Component{
  render() {
    return (
      <header>
        <div className="top">
          <div className="top-bg"></div>
          <div className="top-bg2">
            <i className="icon-logo"></i>
            <div className="banner">
              <Link to={rootPath+"/"} >
                首页
              </Link>
              <Link to={rootPath + '/yysc'} className="current">
                应用市场
              </Link>
              <Link to={rootPath + '/aboutUs'}>
                关于我们
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header

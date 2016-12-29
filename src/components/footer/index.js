import React from 'react'
// import './index.sass'

class FooterEle extends React.Component{
  render() {
    return (
      <footer className={this.props.bgcolor}>
        <div className="top">
          <div className="erweima">
          </div>
          <div className="down-btns">
            <a className="ios-down">
              iPhone版下载
            </a>
            <a className="android-down">
              Android版下载
            </a>
          </div>
        </div>
        <i className="slogan">
        </i>
        <i className="logo">
        </i>

        <div className="aboutUs">
          <span>关于天游互娱</span>
          <span>联系我们</span>
          <span>官方微博</span>
        </div>
        <div className="beian">
          <span>点乐 © 2015 保留一切权利 京ICP备12010382号</span>
        </div>
      </footer>
    )
  }
}

export default FooterEle

import React, { Component } from 'react'
// import './goodItem.sass'

class GoodItem extends Component {
  render() {
    return (
      <div className="good">
        <i className="icon">
        </i>
        <span className="name">
          方块骑士
        </span>
        <span className="down-num">1.2亿人下载</span>
      </div>
    )
  }
}

export default GoodItem

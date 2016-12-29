import React , { Component } from 'react'
import './about.sass'

class About extends Component {
  render(){
    return (
      <div className="about">
        <i className="about-logo"></i>
        <ul>
          <li>
            <i className="icon icon-hlzy"></i>
            <span className="theme">海量资源</span>
            <span className="describe">海量精品手游<br/>一站式免费下载</span>
          </li>
          <li>
            <i className="icon icon-xycx"></i>
            <span className="theme">新游尝鲜</span>
            <span className="describe">第一时间提供新游预约下载<br/>尝鲜快人一步</span>
          </li>
          <li>
            <i className="icon icon-jptj"></i>
            <span className="theme">精品推荐</span>
            <span className="describe">资深游戏主编为您推荐<br/>最好玩的游戏内容</span>
          </li>
          <li>
            <i className="icon icon-glcp"></i>
            <span className="theme">攻略测评</span>
            <span className="describe">全面的游戏攻略评测<br/>让您随处掌握</span>
          </li>
          <li>
            <i className="icon icon-czfl"></i>
            <span className="theme">超值福利</span>
            <span className="describe">丰富的热门游戏活动礼包<br/>让您畅爽体验游戏</span>
          </li>
          <li>
            <i className="icon icon-gqsp"></i>
            <span className="theme">高清视频</span>
            <span className="describe">海量原创的高清游戏视频<br/>让您随兴观看</span>
          </li>
          <li>
            <i className="icon icon-mnkf"></i>
            <span className="theme">美女客服</span>
            <span className="describe">7*24小时的热情美女客服<br/>随时为你答疑解惑</span>
          </li>
        </ul>
        <i className="banner-center"></i>
      </div>
    )
  }
}

export default About

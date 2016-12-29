import React from 'react'
import Header from './header'
import './aboutUs.sass'

class AboutUs extends React.Component {
  render() {
    return (
      <div className="container about">
        <Header/>
        <i className="aboutus-banner"></i>
        <div className="content">
          <i className="icon"></i>
          <p>
            “天游互娱”隶属于北京蜜点科技有限公司，是一家专注于游戏内容分享的一站式手游互动娱乐平台，
            下设手游下载、新游预约、精品推荐、游戏排行、攻略养成、超值礼包等各类功能专区。
          </p>
          <p>
            公司致力于优秀游戏的发掘和运营，以为中国玩家提供优质、便捷、快乐的游戏体验为己任，让每一位玩家可以
            畅想游戏带来的乐趣！
          </p>
          <p>
            截止至2016年11月，天游互娱与行业内近200家游戏企业简历密切的合作伙伴关系，收录了上千款精品手游，
            注册用户超过1000万人，日均访问用户超过20万，月活跃用户超过100万，日均流量超过1000万次，各项数据均处于行业领先水平，
            丰富的内容和一流的运营获得了手游玩家和游戏开发商、发行商的广泛赞誉。用心服务好每一位玩家，是每一位天游互娱人的工作理念。
            天游互娱将继续秉承这样的信仰，致力于打造最受玩家喜爱的手游互动娱乐平台。
          </p>
        </div>
      </div>
    )
  }
}

export default AboutUs

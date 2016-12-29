import React, {PropTypes} from 'react'
import Header from './header'
import './yysc.sass'
import GoodItem from '../../../components/goodItem'

class Yysc extends React.Component{

  static propTypes = {
    fetchList : PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      games: [
        {
          img: '',
          name: '方块骑士',
          downCounts: '1.2亿',
          type: 'xxyz'
        },{
          img: '',
          name: '暗点空战',
          downCounts: '1.2亿',
          type: 'wlyx'
        },{
          img: '',
          name: '鱿鱼公司',
          downCounts: '1.3亿',
          type: 'dzmx'
        },{
          img: '',
          name: '太空刑警',
          downCounts: '1.2亿',
          type: 'qpzx'
        },{
          img: '',
          name: '几何比赛',
          downCounts: '1.2亿',
          type: 'fxsj'
        },{
          img: '',
          name: '梦境防御',
          downCounts: '1.3亿',
          type: 'jycl'
        },{
          img: '',
          name: '方块骑士',
          downCounts: '1.2亿',
          type: 'jycl'
        },{
          img: '',
          name: '暗点空战',
          downCounts: '1.2亿',
          type: 'jsby'
        },{
          img: '',
          name: '鱿鱼公司',
          downCounts: '1.3亿',
          type: 'tyjs'
        },{
          img: '',
          name: '太空刑警',
          downCounts: '1.2亿',
          type: 'tyjs'
        },{
          img: '',
          name: '几何比赛',
          downCounts: '1.2亿',
          type: 'jsby'
        },{
          img: '',
          name: '梦境防御',
          downCounts: '1.3亿',
          type: 'jycl'
        },
      ]
    }
  }

  componentDidMount(){

  }

  queryGames(type){

    var queryUrl = ''
    var queryParam = {}

    var games = [
      {
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'xxyz'
      },{
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'wlyx'
      },{
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'dzmx'
      },{
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'qpzx'
      },{
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'fxsj'
      },{
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      },{
        img: '',
        name: '方块骑士',
        downCounts: '1.2亿',
        type: 'jycl'
      },{
        img: '',
        name: '暗点空战',
        downCounts: '1.2亿',
        type: 'jsby'
      },{
        img: '',
        name: '鱿鱼公司',
        downCounts: '1.3亿',
        type: 'tyjs'
      },{
        img: '',
        name: '太空刑警',
        downCounts: '1.2亿',
        type: 'tyjs'
      },{
        img: '',
        name: '几何比赛',
        downCounts: '1.2亿',
        type: 'jsby'
      },{
        img: '',
        name: '梦境防御',
        downCounts: '1.3亿',
        type: 'jycl'
      },
    ]

    console.log(type)

    if(type){
      this.setState({
        games: games.filter((item) => (
          item.type === type
        ))
      })
    } else {
      this.setState({
        games: games
      })
    }

  }

  render() {
    return (
      <div className="container about">
        <Header/>

        <div className="tabs">
          <ul>
            <li className="selected" onClick= {this.queryGames.bind(this, null)}>全部游戏</li>
            <li onClick= {this.queryGames.bind(this, 'xxyz')}>休闲益智</li>
            <li onClick= {this.queryGames.bind(this, 'wlyx')}>网络游戏</li>
            <li onClick= {this.queryGames.bind(this, 'dzmx')}>动作冒险</li>
            <li onClick= {this.queryGames.bind(this, 'qpzx')}>棋牌中心</li>
            <li onClick= {this.queryGames.bind(this, 'fxsj')}>飞行射击</li>
            <li onClick= {this.queryGames.bind(this, 'jycl')}>经营策略</li>
            <li onClick= {this.queryGames.bind(this, 'jsby')}>角色扮演</li>
            <li onClick= {this.queryGames.bind(this, 'tyjs')}>体育竞速</li>
          </ul>
        </div>
        <div className="games">
          <ul>
            {this.state.games.map(function(game, index){
              return (
                <li key={index}><GoodItem/></li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}


export default Yysc

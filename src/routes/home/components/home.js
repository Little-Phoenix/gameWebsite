import React, { PropTypes } from 'react'
import Header from './header'
import About from './about'
import GoodItem from '../../../components/goodItem'
import Lbfl from '../../../components/lbfl'
import Phb from '../../../components/phb'


class HomeEle extends React.Component {

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    fetchError: PropTypes.func.isRequired
  }


  render() {

    console.log(this.props.fetchError(1));
    return (
      <div className="container home">
        <Header/>
        <About/>
        <GoodItem/>
        <Lbfl/>
        <Phb/>
      </div>
    )
  }
}


export default HomeEle

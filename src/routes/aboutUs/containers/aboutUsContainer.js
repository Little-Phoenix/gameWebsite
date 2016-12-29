import { connect } from 'react-redux'
import { fetchList } from '../../../actions'

import aboutUsEle from '../components/aboutUs.js'

const mapActionCreators = {
  fetchList : (url, options, key, filter) => fetchList(url, options, key, filter)
}

const mapStateToProps = (state) => ({
  aboutUsInfo: state.aboutUs.aboutUsInfo
})

export default connect(mapStateToProps, mapActionCreators)(aboutUsEle)

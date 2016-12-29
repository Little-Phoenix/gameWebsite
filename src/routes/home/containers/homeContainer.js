import { connect } from 'react-redux'
import { fetchList, fetchError } from '../../../actions'

import homeEle from '../components/home.js'

const mapActionCreators = {
  fetchList : (url, options, key, filter) => fetchList(url, options, key, filter),
  fetchError: (status) => fetchError(status)
}

const mapStateToProps = (state) => ({
  homeInfo: state.home.homeInfo
})

export default connect(mapStateToProps, mapActionCreators)(homeEle)

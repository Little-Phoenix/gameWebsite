import { connect } from 'react-redux'
import { fetchList } from '../../../actions'

import yyscEle from '../components/yysc.js'

const mapActionCreators = {
  fetchList : (url, options, key, filter) => fetchList(url, options, key, filter)
}

const mapStateToProps = (state) => ({
  yyscInfo: state.yysc.yyscInfo
})

export default connect(mapStateToProps, mapActionCreators)(yyscEle)

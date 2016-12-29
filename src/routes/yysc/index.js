import { injectReducer } from '../../reducers'
import yysc from './containers/yyscContainer'
import reducer from './modules/yysc'


export default (store, cb) => {
  injectReducer(store, { key: 'yysc', reducer })
  cb(null, yysc)
}

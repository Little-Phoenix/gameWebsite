import { injectReducer } from '../../reducers'
import aboutUs from './containers/aboutUsContainer'
import reducer from './modules/aboutUs'


export default (store, cb) => {
  injectReducer(store, { key: 'aboutUs', reducer })
  cb(null, aboutUs)
}

import { injectReducer } from '../../reducers'
import home from './containers/homeContainer'
import reducer from './modules/home'


export default (store, cb) => {
  injectReducer(store, { key: 'home', reducer })
  cb(null, home)
}

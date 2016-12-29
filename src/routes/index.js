
import $storage from '../services/storage'
import { rootPath } from './config'

import coreLayout from '../layouts/CoreLayout'

function loadRoute(cb, store) {
	return (module) => module.default(cb, store)
}
const hostName = location.hostname
let domain = `http://${hostName}`

function errorLoading(err) {
	// toast('当前页面加载失败, 请刷新重试')
	console.error('Dynamic page loading failed', err)
	const user = $storage.local.get('user')
	const token = $storage.local.get('token')
	const invite = $storage.local.get('invite')
	const ua = navigator.userAgent
	const errorParams = {
		event: 'crush',
		error_info: `${err}&user=${user}&token=${token}&url=${location.href}&invite=${invite}&ua=${ua}`
	}

	fetch(`${domain}/firmware/client/log/`, {
		method: 'post',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify(errorParams)
	})
}

export const createRoutes = (store) => ({
	path: `${rootPath}/`,
	indexRoute: {
		getComponent(nextState, cb) {
			System.import('./home').then(loadRoute(store, cb)).catch(errorLoading)
		}
	},
	component: coreLayout,
	childRoutes: [
		{
			path: `${rootPath}/yysc`,
			getComponent(nextState, cb) {
				System.import('./yysc').then(loadRoute(store, cb)).catch(errorLoading)
			}
		},
		{
			path: `${rootPath}/aboutUs`,
			getComponent(nextState, cb) {
				System.import('./aboutUs').then(loadRoute(store, cb)).catch(errorLoading)
			}
		}
	]
})

export default createRoutes

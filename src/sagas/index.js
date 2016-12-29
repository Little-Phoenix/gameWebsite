import {
	fetchGeted,
	FETCH_DATA,
	modalOpen,
	directTo,
	boolToggle
} from '../actions'
import {
	toast,
	json2url
} from '../services/util'

import 'whatwg-fetch'
import 'es6-promise'

import {
	put,
	call
} from 'redux-saga/effects'
import {
	takeEvery
} from 'redux-saga'

import $storage from '../services/storage'

export const fetchData = (url, options = {}) => {
	const user = $storage.local.get('user')
	const token = $storage.local.get('token')

	const hostName = location.hostname
	let domain = `http://${hostName}`
	
	if (~url.indexOf('http')) {
		domain = ''
	}

	const myHeaders = new Headers()
	const querys = {}
	if (token) {
		myHeaders.append('Authorization', `Token ${token}`)
		// myHeaders.append('Authorization', 'Token 8095ac9aad637ffd6e2f722e661018d3979e36a1')
	}
	if (user) {
		querys.user = user
	}

	let defaultOptions = {}

	if (!options.method) {
		defaultOptions = {
			method: 'GET',
			headers: myHeaders,
			querys
		}
	}
	if (options.method === 'POST') {
		myHeaders.append('Content-Type', 'application/json')
		myHeaders.append('Accept', 'application/json')
		const body = JSON.stringify(options.params)
		defaultOptions = {
			method: 'POST',
			headers: myHeaders,
			body
		}
	}
	if (options.method === 'PUT') {
		myHeaders.append('Content-Type', 'application/json')
		myHeaders.append('Accept', 'application/json')
		const body = JSON.stringify(options.params)
		defaultOptions = {
			method: 'PUT',
			headers: myHeaders,
			body
		}
	}
	if (options.method === 'DELETE') {
		defaultOptions = {
			method: 'DELETE',
			headers: myHeaders
		}
	}
	// 'GET' method querys
	const fetchQeury = json2url(
			Object.assign(
				{},
				querys || {},
				options.querys || {}
			)
	)
	let paramOpe = '?'
	if (~url.indexOf('&')) {
		paramOpe = '&'
	}
	return fetch(`${domain}${url}${paramOpe}${fetchQeury}`, defaultOptions)
}

export function* fetchRequest(action) {
	yield put(boolToggle('isLoading', true))
	const response = yield call(fetchData, action.url, action.options)
	const code = response.status
	let data = yield Promise.resolve(response)
		.then(queryResponse => {
			// code === 204
			if (queryResponse.statusText === 'No Content') {
				return queryResponse || {}
			}
			return queryResponse.text()
		})
	if (!data) {
		data = {}
	} else if (data[0] === '{' && data[data.length - 1] === '}'
	|| data[0] === '[' && data[data.length - 1] === ']') {
		data = JSON.parse(data)
	} else {
		data = {}
	}

	if (code >= 500) {
		yield put(modalOpen({
			content: '服务器出现故障,请耐心等待'
		}))
	} else if (code === 400) {
		yield put(modalOpen({
			content: '请求参数错误'
		}))
	} else if (code === 401) {
		localStorage.removeItem('user')
		localStorage.removeItem('token')
		if (data && data.msg === 'user_inactive') {
			// 用户被禁
			yield put(directTo('/error?info=forbidden'))
		} else {
			// token失效
			yield put(directTo('/error'))
		}
	} else if (code === 403) {
		const path = location.pathname
		let relativePath = ''
		const hostName = location.hostname
		let domain = `http://${hostName}`

		if (path.length > 4) {
			relativePath = path.slice(4)
			fetch(`${domain}/firmware/client/log/?event=403_forbidden&path=${relativePath}`)
		}
		yield put(modalOpen({
			content: (data && data.msg) || '因您的行为异常，部分功能将被禁用。如有疑惑，请联系试玩客服人员。'
		}))
	} else if (code === 410) {
		// avoid reset modal callback
		action.key = 'logEvent'
		yield put(modalOpen({
			content: (data && data.msg) || '您有未完成的任务',
			confirmCallback: () => {
				window.location.reload()
			}
		}))
	} else if (code === 215) {
		action.key = 'logEvent'
		yield put(modalOpen({
			content: '检测到您已经安装过该应用',
			confirm: '刷新列表',
			confirmCallback: () => {
				window.location.reload()
			} // TODO: refresh
		}))
	} else {
		if (data && data.msg) {
			data.code = code
			if (data.toast) {
				toast(data.msg)
			} else {
				if (data.code !== 200) {
					yield put(modalOpen({
						content: data.msg
					}))
				}
			}
		}
	}
	data.code = code
	yield put(fetchGeted(action.key, data, action.filter))
}

export default function* rootSaga() {
	yield* takeEvery(FETCH_DATA, fetchRequest)
}

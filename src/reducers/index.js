import {
	combineReducers
} from 'redux'
import {
	routerReducer as router
} from 'react-router-redux'

import Swipe from '../services/swipe'
import {
	FETCH_GETED,
	BOOL_TOGGLE,
	TAB_TOGGLE,
	TAB_CHEDCKED,
	MODAL_OPEN,
	MODAL_CLOSE,
	CUT_DOWN,
	TICK,
	VAL_CHANGE
}
from '../actions'

export const globalHandler = {
	[FETCH_GETED]: (state, action) => {
		// 给对象某个key赋值, 比如 : a.b.c = d
		function recLookup(obj, path, value) {
			if (path.length === 1) {
				obj[path[0]] = value
				return
			}
			recLookup(obj[path[0]], path.slice(1), value)
		}
		const newState = JSON.parse(JSON.stringify(state))
		newState.isLoading = false
		if (action.key === 'logEvent' || (!action.key || !action.data) && !action.filter) return state
		if (action.key === 'tasks') {
			newState.isReload = false
		}
		let resultData
		if (Array.isArray(action.key)) {
			recLookup(newState, action.key, action.filter(action.data))
		} else {
			resultData = action.filter(action.data)
			if (action.key) {
				newState[action.key] = resultData
			}
			// newState[action.key] = action.filter(action.data)
		}
		return newState
	},
	[BOOL_TOGGLE]: (state, action) => ({
		...state,
		[action.key]: action.val || !state[action.key]
	}),
	[TAB_TOGGLE]: (state, action) => ({
		...state,
		tab: action.newTab
	}),
	[TAB_CHEDCKED]: (state, action) => {
		const newState = Object.assign({}, state)
		if (!newState.tabs) return state
		newState.tabs[action.tabNum].checked = true
		return newState
	},
	[CUT_DOWN]: (state, action) => {
		const newState = Object.assign({}, state)
		newState.verifyInfo = action.cutDownInfo
		return newState
	},
	[TICK]: (state, action) => ({
		...state,
		delay: state.delay ? (state.delay - 1) : action.resetDelay
	}),
	[MODAL_OPEN]: (state, action) => {
		if (state.modalState) return state
		return {
			...state,
			modal: Object.assign({}, action.payload),
			modalState: true
		}
	},
	[MODAL_CLOSE]: (state) => ({
		...state,
		modalState: false
	}),
	[VAL_CHANGE]: (state, action) => {
		let finalState
		if (action.key in state) {
			finalState = {
				...state,
				[action.key]: action.val
			}
		} else {
			finalState = state
		}
		return finalState
	},
}

const reducers = (asyncReducers) => combineReducers({
	router,
	...asyncReducers
})

export const injectReducer = (store, {
	key,
	reducer
}) => {
	store.asyncReducers[key] = reducer
	store.replaceReducer(reducers(store.asyncReducers))
}

export default reducers

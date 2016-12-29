import React, { PropTypes } from 'react'
import Footer from '../../components/footer'
// import Header from '../../components/header'
import { header, rootPath } from '../../routes/config'
import { isNumber } from '../../services/util'
import $storage from '../../services/storage'

const hostName = location.hostname
let domain = `http://${hostName}`
if (location.hostname === '91atm.local.com') {
	domain = 'http://91atm.aa123bb.com'
}

function pageLog() {
	let userParam = ''
	const user = $storage.local.get('user') || ''
	if (user) {
		userParam = `&user=${user}`
	}
	let params = ''
	if (location.search) {
		params = `&${location.search.slice(1)}`
	}
	const appVersion = ($storage.local.get('91atm')
	&& JSON.parse($storage.local.get('91atm')).app_version) || ''
	let appVersionParam = ''
	if (appVersion) {
		appVersionParam = `&appVersion=${appVersion}`
	}
	let path = ''
	if (location.pathname && location.pathname.length > 4) {
		path = encodeURIComponent(location.pathname.slice(4))
		fetch(`${domain}/firmware/web/visit/?page=${path}${userParam}${params}${appVersionParam}`)
	}
}

function fontResize() {
	const width = document.body.offsetWidth
	const fontSize = width / 320 * 12
	document.querySelector('html').style.fontSize = `${fontSize}px`
	return fontSize
}

const screenHeight = Math.max(document.documentElement.clientHeight || window.innerHeight)


class CoreLayout extends React.Component {
	constructor(props) {
		super(props)
		this.unreadNum = +$storage.local.get('unread_num') || 0
	}
	componentDidMount() {
		pageLog()
	}

	componentDidUpdate() {
		pageLog()
	}

	render() {
		let pathName = this.props.location.pathname.replace(rootPath, '')

		let headerEle
		let footerEle = <Footer />

		if (~pathName.indexOf('aboutUs') || ~pathName.indexOf('yysc')){
			footerEle = <Footer bgcolor='with-color'/>
		}

		return (
			<div id="root-wrap">
				{headerEle}
				{this.props.children}
				{footerEle}
			</div>
		)
	}
}

CoreLayout.propTypes = {
	children: PropTypes.element.isRequired,
	location: PropTypes.object.isRequired
}

CoreLayout.contextTypes = {
	router: PropTypes.object.isRequired
}

export default CoreLayout

function urlparser (url) {
	let a = document.createElement('a');
	a.href = url;
	return {
		protocol: a.protocol,
		hostname: a.hostname,
		port: a.port,
		pathname: a.pathname,
		query: a.search,
		hash: a.hash,
		host: a.host
	}
}

function errorHandler (msg, url, row, col, error) {
	let err = {
		message: msg,
		url: url,
		row: row,
		col: col
	};
	console.error(err);
	this.renderError(err);
	return false;
}

function renderError (err) {
	let container = document.createElement('div')
	container.classList.add('error');
	container.textContent = [
		this.urlparser(err.url).pathname || ''
		, err.row || ''
		, err.col || ''
		, err.message || ''
	].join(':');
	document.body.appendChild(container);
}



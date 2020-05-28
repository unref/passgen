// instantiate widget
window.addEventListener('DOMContentLoaded', function () {
	window.onerror = window.errorHandler && window.errorHandler.bind(window) || null;

	new PasswordGeneratorWidget({
		selector: '#password-generator',
		length: 16,
		charTypes: ['numbers', 'uppercase', 'lowercase'],
	});
});

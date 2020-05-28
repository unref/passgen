// instantiate widget
window.addEventListener('DOMContentLoaded', function () {
	window.onerror = errorHandler;

	new PasswordGeneratorWidget({
		selector: '#password-generator',
		length: 16,
		charTypes: ['numbers', 'uppercase', 'lowercase'],
	});
});

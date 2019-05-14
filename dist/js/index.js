'use strict';

// instantiate widget
window.addEventListener('load', function () {
  new PasswordGeneratorWidget({
    id: 'password-generator',
    length: 16
  });
});
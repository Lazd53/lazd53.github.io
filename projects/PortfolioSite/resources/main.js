// Script to add a listener to the menu button, and toggle the class 'open' on and off.
var colorMenu = document.querySelector('#sidebar');
var main = document.querySelector('main');
var sidebar = document.querySelector('#sidebar')

colorMenu.addEventListener('click', function (e){
  sidebar.classList.toggle('open');
});

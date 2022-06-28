// ==UserScript==
// @name         Local hosting
// @version      0.1
// @description  Inject current experiment HTML onto the page
// @author       Chase Marlow
// @include /.*:\/\/www.(national|alamo|enterprise).*/
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource html file:///Users/[yourusername]/[pathtofolder]/isobar-mvt/mvt-tools/currentFile.html
// @grant  GM_getResourceText
// ==/UserScript==

(function() {
  'use strict';

  $(function() {
    // Using jQuery so the script tag in the HTML gets executed
    $('body').append(GM_getResourceText('html'));
  });
})();
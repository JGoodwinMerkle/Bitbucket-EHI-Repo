var h = document.location.hostname;
if ((typeof enterprise !== 'undefined' && ( /enterprise\.(com|co\.uk|ca|ie|es|fr|de)/.test(h) || /enterprise-(int|xqa)\d?-aem\.enterprise/gi.test(h))) || 
	/www\.alamo\.(com|ca)/.test(h) || 
	/(www|beta)\.nationalcar\.(com|ca|co\.uk|de|ie|es|it|fr)/.test(h) 
	|| /(int|xqa)\d?\.natcar-np/gi.test(h)) {

	//Target library code goe here

}

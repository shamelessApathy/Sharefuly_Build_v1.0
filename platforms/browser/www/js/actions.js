$(function(){

console.log(document.cookie);

	var button_upload = document.getElementById('button-upload-image');
	$(button_upload).on('click', function(){
		console.log('inside button click function for upload');
		window.location = 'upload_image.html';
	})
})
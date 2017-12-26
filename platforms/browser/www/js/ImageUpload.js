  // Tool in OOP ES5 to upload images via phonegap android app
var ImageUpload = function(){
    this.init = function()
    {
        function getCookie(cname) 
        {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        console.log('inside init() funciton of ImageUpload');   
        this.user_id = getCookie("user_id");
        
    }
    this.listen = function()
    {
        $('#ie-upload-submit').on('click', function(e) 
        {
            var cat_id = document.getElementById('upload-category');
            e.preventDefault();
            var file = $('#image_file');
            console.log(file[0].files[0]);
            var true_file = file[0].files[0];
              var fd = new FormData();
              fd.append("image", true_file);
              // These extra params aren't necessary but show that you can include other data.
              fd.append("user_id", this.user_id);
              fd.append('tags', $('#tag_holder').val());
              fd.append('category-id', cat_id.options[cat_id.selectedIndex].value);
              fd.append('image-name', $('#image-name').val());   
              fd.append('rotate',$('#rotate').val());
              fd.append('app', "true");
              var xhr = new XMLHttpRequest();
              xhr.open('POST', 'https://sharefuly.com/image/new_image', true);
              
              xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                  var percentComplete = (e.loaded / e.total) * 100;
                  console.log(percentComplete + '% uploaded');
                }
              };
              xhr.onload = function() {
                if (this.status == 200) {
                  var resp = this.response; 
                  if (resp === "true")
                  {
                    if(confirm('Image Upload Sucessful!'))
                    {
                      window.location = "upload_image.html";
                    }
                  }
                };
              };
              xhr.send(fd);  
        }.bind(this))
    }.bind(this)
    this.init();
    this.listen();
}

var iu = new ImageUpload();
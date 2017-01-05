$('#getScore-button').click(function() {
  console.log("get user")
   $.ajax({
       type: 'GET',
       url: 'http://localhost:3000/userData'
   });
});

$("#submitUser-button").click(function(){
   var formData = $(form).serialize();
   console.log(formData)
   $.ajax({
     type: 'POST',
     url: $(form).attr('action'),
     data: formData
 })
});

//API

// get Ethereum Wallet(password)
// Save User Data (encrypt(time,score,IDRef,name,address))
// Save HashValue(hash(time,score,IDRef,name,address))

// Scoring (Face diff, Address/GPS difference, Time)

//Facial Recognition - Open Face 
//https://github.com/cmusatyalab/openface/blob/master/demos/compare.py
// gives a  difference between pictures - floating point

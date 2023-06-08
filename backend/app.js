var admin = require("firebase-admin");

var serviceAccount = require("./ics125-2195d-firebase-adminsdk-6soex-ea2d94eb2a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ics125-2195d-default-rtdb.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("userinfo/Yp3vP08FybO14bSJwNmiwANFoVm1");

ref.once("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
  
    //THIS IS JUST A PLACEHOLDER ALGO 
    // Ensure Weight and Height are numbers
    var weight = parseFloat(data.Weight);
    var height = parseFloat(data.Height);
  
    if (isNaN(weight) || isNaN(height)) {
      console.log('Error: Weight or Height is not a number');
      return;
    }
  
    // Calculate BMI
    var bmi = weight / Math.pow(height, 2);
    
    // Check if BMI is within healthy range
    var recommendation = false;  // default to false
    if (bmi >= 18.5 && bmi <= 24.9) {
      recommendation = true;
    }
    
    //THIS IS HOW U ACTUALLY WRITE THE RESULTS BACK TO THE DATABASE
    // Write Recommendation to database
    ref.update({ 
      Recommendation: recommendation 
    }, function(error) {
      if (error) {
        console.log('Error updating data:', error);
      } else {
        console.log('Data updated successfully');
      }
    });
  });
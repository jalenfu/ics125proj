HOW TO TEST INITIALIZE:
cd backend
npm install firebase-admin

HOW TO TEST:
1. First go to the Firebase console -> Project settings -> Service accounts -> Generate new private key
2. Add private key to backend directory and make sure the private key path matches the one in line 3 in app.js
3. Run the following command:
node app.js
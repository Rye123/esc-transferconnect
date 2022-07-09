// DO NOT MODIFY

let exec = require('child_process').exec;

console.log("Building the React app...");
let direction = 0;
let loading = setInterval(() => {
   if (direction % 4 == 0)
      process.stdout.write("/  BUILDING     /\r")
   else if (direction % 4 == 1)
      process.stdout.write("|  BUILDING.    |\r")
   else if (direction % 4 == 2)
      process.stdout.write("\\  BUILDING..   \\\r")
   else
      process.stdout.write("—  BUILDING...  —\r")
   direction++;
},500);
exec("react-scripts build", (err, stdout, stderr) => {
   clearInterval(loading);
   if (err) {
      console.error(stderr);
      return;
   }
   console.log("Build generated. Move /build to ../bank-server/ to run it on the same server.");
})
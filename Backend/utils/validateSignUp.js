const validator = require('validator');

const validateSignUp = (req) => {
  const { firstName, email, password,phoneNumber ,skills } = req.body;

  if (!firstName) {
    throw new Error("First name is required");
  }   // can be omitted validation here as firsName doesn't need any regex, mongoose will handle it automatically 

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be between 4 to 50 characters");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email is not correct!!!"); // validating email in schema as well as here also , but if email is incorrect error will be shown from here not from schema.... if email:required in schema and no validation check for that , and user omit it then mongoose will throw an error, but if user gives any random words ex : email:tfydy mongoose will accept it ... so if something is required(schema) , omit validation if that doesn't need any regex ex firstName ,lastName ... but if that need regex eg email , password then give validation 
  }

  if (!validator.isStrongPassword(password)) {
      console.log(`password`,password)
    throw new Error("Password is not strong enough");
  }

  if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
    throw new Error("Phone number is not correct");
  }
  
  if(skills?.length>5){
    throw new Error(`skills cannot be more than 5`);
  }
};

module.exports = validateSignUp;

//Parent Class

class Person {
  static aadharNumber = 123456781234;
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  who() {
    console.log("Im Person");
  }
}

//Subclass
class Employee extends Person {
  companyName;
  constructor(firstName, lastName, companyName) {
    super(firstName, lastName);
    this.companyName = companyName;
  }
  who() {
    console.log("Im Employee");
  }
}

function hello(){
    console.log("Hello method call");
}

//Instance of subclass

const employee1 = new Employee("Yash", "Lathiya", "RKIT");
console.log(employee1.firstName);
employee1.who();

//Parent class has static variable, which can not be accessed by instance.

//returns undefined as it has no access
//Similar result will be appeared on screen if try to access static variable by parent class' instance
console.log(employee1.aadharNumber);
class Person {
  constructor(name) {
    this.name = name;
  }
  describe = () => {
    return `Person named ${this.name}`;
  }
}

class Man extends Person {
  // hi = () => {
  //   return this.describe();
  // }
  hi() {
    return this.describe();
  }
}


const p = new Man('Alex');
const describe = p.describe;
console.log(describe());

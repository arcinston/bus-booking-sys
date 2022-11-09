import User from '../model/user';

class GoogleUser extends User {
  username: string;
  imageUrl: string;
  //Generating google user object
  constructor(data: any) {
    super();
    (this.username = data.givenName),
      (this.email = data.email),
      (this.fname = data.givenName),
      (this.lname = data.familyName),
      (this.googleId = data.googleId),
      (this.imageUrl = data.imageUrl),
      (this.phone = 'Enter phone'),
      (this.address = 'Enter address'),
      (this.password = 'null - random'),
      (this.nic = 'Enter NIC'),
      (this.discount = false),
      (this.enabled = true),
      (this.loginCount = data.loginCount);
  }
}

export default GoogleUser;

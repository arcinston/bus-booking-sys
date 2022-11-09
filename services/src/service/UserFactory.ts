import RegularUser from '../domain/RegularUser';
import GoogleUser from '../domain/GoogleUser';

const createUser = (data: any) => {
  if (data.type == 'regular') return new RegularUser(data);
  return new GoogleUser(data);
};

export default createUser;

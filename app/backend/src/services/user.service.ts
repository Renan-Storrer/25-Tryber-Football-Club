import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/UserModel';
import IResponse from '../interfaces/IResponse';
import ILogin from '../interfaces/ILogin';
import { grResponse, grResponseErr } from '../utils/grResponse';
import gnToken from '../utils/JWT';
import { validateLogin } from '../utils/validations/inputs';

class UserService {
  private _model: ModelStatic<User> = User;

  async login(body: ILogin): Promise<IResponse> {
    const users = await this._model.findAll();
    const user = users.find((e) => e.email === body.email);

    const error = validateLogin(body);
    if (error) return grResponseErr(401, 'Invalid email or password');

    const checkPass = bcrypt.compareSync(body.password, user?.password || '_');

    if (!user || !checkPass) return grResponseErr(401, 'Invalid email or password');

    const { id, email, role, username } = user;
    const token = gnToken({ id, email, role, username });
    return grResponse(200, { token });
  }
}

export default UserService;

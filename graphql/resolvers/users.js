const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/Users');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');


function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        userName: user.userName
    }, SECRET_KEY, { expiresIn: '1h' });
}
module.exports = {
    Mutation: {
        async login(
            _,
            { userName, password }
        ) {
            const { errors, valid } = validateLoginInput(userName, password);
            const user = await User.findOne({ userName });

            if (!valid){
                throw new UserInputError('Errors', { errors });
            }
            if (user){

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    errors.general = 'Wrong Credentials';
                    throw new UserInputError('Wrong Credentials', { errors });
                }
            } else {
                throw new UserInputError('UserName not found');
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };

        },
        async register(
            _, 
            { 
                registerInput: { userName, password, confirmPassword, email }
            },
            context, 
            info
            )
            {
                const {errors, valid } = validateRegisterInput(userName, email, password, confirmPassword);

                if (!valid) {
                    throw new UserInputError('Errors', { errors });
                }
                const user = await User.findOne({userName});
                if (user) {
                    console.log(user);
                    throw new UserInputError('The Username is already taken', {
                        errors: {
                            userName: 'The username is alredy taken'
                        }
                    });

                }
                password = await bcrypt.hash(password, 12);

                const newUser = new User({
                    userName,
                    password,
                    email,
                    createdAt: new Date()
                });
                const res = await newUser.save();

                const token = generateToken(res);

                return {
                    ...res._doc,
                    id: res._id,
                    token
                };
         }
    }
}
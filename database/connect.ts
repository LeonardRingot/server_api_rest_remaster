import { DataTypes, Sequelize } from "sequelize"
import { tokenTypes } from "../types/token"
import { userTypes } from "../types/user"
import { users } from './mock-user'

import { tokens } from './mock-token'


const UserModel = require('../models/users')
const TokenModel = require('../models/tokens')


const sequelize = new Sequelize(
//    "DatabaseCse",
//     'alexis',
//     '123456',
    `${process.env.NAME_DATABASE}`,
    `${process.env.HOST_DATABASE}`,
    `${process.env.PASS_DATABASE}`,
    {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            useUTC: false,
            dateStrings: true,
            typeCast: true
        },
        timezone: '+02:00'
    }
)

sequelize.authenticate()
    .then(() => console.log('Link established'))
    .catch((error: Error) => console.error(`Error: ${error}`)
    )

export const User = UserModel(sequelize, DataTypes)
export const Token = TokenModel(sequelize, DataTypes)



User.hasOne(Token, { onDelete: 'cascade', hooks: true, foreignKey:'UserId' })
Token.belongsTo(User, { onDelete: 'cascade', hooks: true,foreignKey:'UserId' })



export const initDb = () => {
    return sequelize.sync({ force: true }).then(() => {

        users.map((user: userTypes, index: number) => {
            User.create({
                pseudo: user.pseudo,
                email: user.email,
                pwd: user.pwd,
                nom: user.nom,
                prenom: user.prenom,
                birthday:user.birthday,
                bio:user.bio
            }).then((response: { toJSON: () => string }) => console.log(response.toJSON()))
        })

        tokens.map((token: tokenTypes) => {
            Token.create({
                refreshToken: token.refreshToken,
                tokenPush: token.tokenPush,
                UserId: token.UserId
            }).then((response: { toJSON: () => string }) => console.log(response.toJSON()))
        })

        console.log('Database created')
    })
}

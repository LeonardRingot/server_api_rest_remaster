import {  DataTypes, Sequelize, STRING } from "sequelize"


module.exports = (sequelize : Sequelize, dataTypes : typeof DataTypes) => {

    const concatRequiredMessage = (data : string) => {
        return `${data} is required`
    }

    return sequelize.define('user', {

        id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, 
        },
        pseudo: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Pseudo')},
                notEmpty : { msg : concatRequiredMessage('Pseudo')}
            }
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false,
            unique: true,
            validate : {
                isEmail:true, 
                notNull: { msg : concatRequiredMessage('Email')},
                notEmpty: { msg : concatRequiredMessage('Email')}
            }
        },
        pwd: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Pwd')},
                notEmpty : { msg : concatRequiredMessage('Pwd')}
            }
        },
        nom: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Nom')},
                notEmpty : { msg : concatRequiredMessage('Nom')}
            }
        },
        prenom: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg : concatRequiredMessage('Prenom')},
                notEmpty : { msg : concatRequiredMessage('Prenom')}
            }
        }, 
        birthday: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: { msg: concatRequiredMessage('birthday date') },
                notEmpty: { msg: concatRequiredMessage('birthday date') }
            }
        },
        bio: {
            type: dataTypes.STRING,
            allowNull: true
        },
        
    })
}
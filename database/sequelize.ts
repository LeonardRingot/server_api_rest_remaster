import { Sequelize } from 'sequelize'
export const sequelize = new Sequelize(
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
);
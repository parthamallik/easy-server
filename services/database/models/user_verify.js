module.exports = (sequelize, DataTypes) => {
    const UserVerify = sequelize.define('UserVerify', {
        'id': {
            'type': DataTypes.INTEGER,
            'primaryKey': true,
            'autoIncrement': true
        },
        'userid': DataTypes.INTEGER,
        'verifytoken': DataTypes.TEXT
    }, {
        'tableName': 'user_verify'
    });
    return UserVerify;
};
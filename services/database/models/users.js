module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        'id': {
            'type': DataTypes.INTEGER,
            'primaryKey': true,
            'autoIncrement': true
        },
        'firstname': DataTypes.TEXT,
        'lastname': DataTypes.TEXT,
        'password': DataTypes.TEXT,
        'email': {
            'type': DataTypes.TEXT,
            'unique': true
        },
        'isverified': DataTypes.BOOLEAN,
        'createdat': DataTypes.DATE,
        'modifiedat': DataTypes.DATE
    }, {
        'tableName': 'users'
    })
    return User;
};
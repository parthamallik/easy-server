module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        'userid': DataTypes.INTEGER,
        'secret': DataTypes.TEXT
    }, {
        'tableName': 'tokens',
    });
    return Token;
};

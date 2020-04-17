module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Pet', {
        'id': {
            'type': DataTypes.INTEGER,
            'primaryKey': true,
            'autoIncrement': true
        },
        'name': DataTypes.TEXT,
        'color': DataTypes.TEXT,
        'type': DataTypes.TEXT,
        'quantity': DataTypes.INTEGER,
        'createdBy' : { type : DataTypes.INTEGER, field : "created_by"},
        'modifiedBy' : { type:DataTypes.INTEGER, field : "modified_by"},
        'createdAt': { type:DataTypes.DATE, field : "created_at"},
        'modifiedAt': { type:DataTypes.DATE, field : "modified_at"}
    }, {
        'tableName': 'pets'
    })
    return User;
};

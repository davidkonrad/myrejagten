/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('indsamler', {
    indsamler_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    navn: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    email: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    telefon: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'indsamler',
    freezeTableName: true
  });
};

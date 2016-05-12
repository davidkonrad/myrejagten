/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kommentar_type', {
    type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    relation: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'kommentar_type',
    freezeTableName: true
  });
};

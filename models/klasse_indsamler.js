/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klasse_indsamler', {
    klasse_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    indsamler_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'klasse_indsamler',
    freezeTableName: true
  });
};

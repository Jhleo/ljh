const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize')
const path = require('path')
const dbFile = path.join(__dirname, 'db.sqlite3')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    logging: false,//关闭sql log
});
exports.sequelize=sequelize
class User extends Model {}
exports.User=User
User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    salt: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM('F', 'M'),
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'User'
})

class Vote extends Model {}
exports.Vote=Vote
Vote.init({
    title: DataTypes.STRING,
    multi:DataTypes.STRING,
    desc: DataTypes.BOOLEAN,//单或多选
    deadline:DataTypes.DATE,//匿名投票
    restrictShare:DataTypes.BOOLEAN,//限制传播
}, {
    sequelize,
    modelName: 'Vote'
})
User.hasMany(Vote)
Vote.belongsTo(User)


class Option extends Model{ }
exports.Option=Option
Option.init({
    content:DataTypes.STRING,
},{
    sequelize,
    modelName: 'Option',
    // timestamps:false // 关闭时间戳
})
Vote.hasMany(Option)
Option.belongsTo(Vote)

User.belongsToMany(Option, {
    through: 'UserVoting',
  })
  Option.belongsToMany(User, {
    through: 'UserVoting',
  })

sequelize.sync()
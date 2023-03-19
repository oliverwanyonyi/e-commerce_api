module.exports = (sequelize,Sequelize) =>{
     const users = sequelize.define('users',{
        name:{
            type:Sequelize.STRING,
            unique:true,
        },
        email:{
            type:Sequelize.STRING,
            unique:true,
            allowNull: false,
        },
        password:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        phone:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        verified:{
            type:Sequelize.STRING,
            default:false
        }
     });
     return users
}
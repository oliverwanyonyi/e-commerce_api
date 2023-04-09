module.exports = (sequelize,Sequelize)=>{

    const Transaction  =  sequelize.define("Transaction",{
    reference:{
        type:Sequelize.STRING,

    },
    paid:{
        type:Sequelize.BOOLEAN,
        defaultValue: false,
    },
    checkoutId:{
        type:Sequelize.STRING,
        defaultValue: false,    
      allowNull: false,
    },
    amount:{
        type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },phone:{
        type: Sequelize.STRING,
      allowNull: false, 
    },
    transactionId:{
        type: Sequelize.INTEGER,
    }
    })

    return Transaction
}
const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb://localhost:27017/CRUD_DB'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}

// module.exports = {
//     url: 'mongodb://localhost:27017/CRUD_DB'
// }
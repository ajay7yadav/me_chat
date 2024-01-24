const userRoute = require('../controllers/user.controller.js');

module.exports = ( app ) =>{

    app.post('/api/auth/login', userRoute.login);
    app.post('/api/auth/signin', userRoute.signin);
    app.post('/api/auth/setAvatar/:id', userRoute.setAvatar);
    app.get('/api/auth/allUsersRoutes/:id', userRoute.allUsersRoutes);
}
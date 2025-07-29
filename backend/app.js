const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const signupRouter = require('./controllers/signup');
const { getTokenFrom } = require('./utils/middleware');
const verifyOtpRouter = require('./controllers/verifyOtp');
const googleAuth = require('./controllers/googleAuth');


app.use(express.json());
app.use(cors())
app.use(getTokenFrom);

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/verify-otp', verifyOtpRouter);
app.post('/api/auth/google', googleAuth);
app.get('/', (req, res)=>{
    res.send('<h1>Welcome to the API</h1>')
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);    
});
const connecttomongo=require('./db'); 
const express=require('express'); 
connecttomongo(); 

const app=express(); 
const port=5000;  
 
/* middleware to parse */
app.use(express.json());

app.use('/api/auth',require('./routes/auth')); 
app.use('/api/notes',require('./routes/notes'));
// app.get('/',(req,res)=>{ 
//    res.send('hello berozgaar');
// });

app.listen(port,()=>{ 
  console.log(`listening to http://localhost:${port}`);
}) ;
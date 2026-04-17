const { MongoClient } = require("mongodb");
require('dotenv').config()




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Will either prompt for login if not authenticated';
  res.send(outstring);
});

app.get('/login', function(req,res) {
//login form, could try to do form handling in this one as well? not sure what that would take

});

app.get('api/tasks/search',function(req, res){
    

});

app.get('/api/tasks/:item', function(req, res) {
const client = new MongoClient(uri);
const searchKey = "{ partID: '" + req.params.item + "' }";
console.log("Looking for: " + searchKey);

async function run() {
  try {
    const database = client.db('cmps4150');
    const parts = database.collection('parts');

    // Hardwired Query for a part that has partID '12345'
    // const query = { partID: '12345' };
    // But we will use the parameter provided with the route: URL/api/mongo/12345
    
    const query = { partID: req.params.item };

    const part = await parts.findOne(query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});


let expr = require ("express");
let fs = require ("fs");

const app = expr();
const router = expr.Router();
app.use(expr.static("/snap/AdminModule/public"));
app.set("view engine", "pug");

app.use(expr.urlencoded({ extended: true }));
app.use(expr.json());
app.use("/", router);
var http = require('http');
var https = require('https');
var httpServer = http.createServer(app);
var httpsServer = 
https.createServer({
  cert: fs.readFileSync('public/ssl_cert/server.crt', 'utf8'),
  key: fs.readFileSync('public/ssl_cert/key.pem', 'utf8')
},app);
httpServer.listen(8080);
httpsServer.listen(8443);


let users;
fs.readFile("public/users.json", (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});
let enums;
fs.readFile("public/enums.json", (err, data) => {
  if (err) throw err;
  enums = JSON.parse(data);
});
let news;
fs.readFile("public/news.json", (err, data) => {
  if (err) throw err;
  news = JSON.parse(data);
});

function updateJSON(users) {
  let usersJSON = JSON.stringify(users);
  fs.writeFile("public/users.json", usersJSON, (err) => {
    if (err) console.log("Error!");
  });
}
router.get("/adminModule/users", (request, response) => {
  response.render("users", {
    users: users
  });
});

router.get("/adminModule/users/:num", (request, response, next) => {
  let id = request.params.num;
  let currentUser =  users.find(el => el.id==id)
      const friends = users.filter((user) => currentUser.friends.includes(user.id));
      console.log(friends)
      response.render("userCard", {
        user: currentUser,
        enums: enums,
        friends:friends
      });
    
  next();
});
router.get("/adminModule/users/:num/news", (request, response, next) => {
  let id = request.params.num;
  let currentUser =  users.find(el => el.id==id)
    const usersNews = news.filter((userNew) => currentUser.friends.includes(userNew.id));
      for (let el of usersNews){
        const user = users.find(e => e.id==el.id)
        el.name = user.name
        el.avatar = user.avatar
      }
        
      console.log(usersNews)
      response.render("usersNews", {usersNews: usersNews});
    
  next();
});

router.post("/adminModule/users/:num", (request, response, next) => {
  console.log("post user", request.body)
  let id = request.params.num;
  for (let value in users)
    if (users[value].id == id) {
      users[value].name = request.body.name
      users[value].date_of_birth = request.body.date_of_birth
      users[value].email = request.body.email
      users[value].role = request.body.role
      users[value].status = request.body.status

  updateJSON(users);
    }
  next();
});

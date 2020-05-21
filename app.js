const express=require("express")
const bodyParser=require("body-parser")
const date=require(__dirname+"/date.js")
const ejs= require('ejs')

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

var items=["Buy Eggs","Have lunch at friend's house"];
var works=[];

app.set('view engine', 'ejs');

var today=date.getDate();




app.get('/', (req, res) => {
  res.render('list', {listtitle: today,items:items});
});

app.post('/',function (req,res) {
  {
    var item=req.body.newItem;
    if(req.body.list==="Work List")
    {
      works.push(item);
      res.redirect("/work")
    }
    else {
      items.push(work);
      res.redirect("/");
    }
  }

});

app.get('/work',function (res,res) {
  res.render("list",{listtitle:"Work List",items:works});

});


app.listen(3000,function () {
  console.log("Server is working fine");
})

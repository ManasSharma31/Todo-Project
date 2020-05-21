const express=require("express")
const bodyParser=require("body-parser")
const date=require(__dirname+"/date.js")
const ejs= require('ejs')
const mongoose=require("mongoose")
const _=require('lodash')
mongoose.connect("mongodb://localhost:27017/TodoDb",{useUnifiedTopology:true,useNewUrlParser:true})

const itemSchema = mongoose.Schema({
  name:String
});

const listSchema=mongoose.Schema({
  name:String,
  listitem:[itemSchema]
});

const Item=mongoose.model("Item",itemSchema);

const List=mongoose.model("List",listSchema);


const i1=new Item(
  {
    name:"Press the + button to add a work."
  }
);
const i2=new Item(
  {
    name:"Click on the checkbox to delete the item."
  });
const i3=new Item(
    {
      name:"Add / name of the list you want to create in the Url Box."
    }
);

const defaultitems=[i1,i2,i3];
// Item.deleteMany({},function (e) {
// if(e)
//   console.log(e);
//   else {
//     console.log("SuccessFully Deleted");
//   }
// })
//



const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


app.set('view engine', 'ejs');

var today=date.getDate();




app.get('/', (req, res) => {
  Item.find({},function (err,fitems) {
    if(fitems.length==0)
    {
      Item.insertMany(defaultitems,function (err) {
        if(err)
        console.log(err);
        else {
          console.log("Success");
        }
      });
      res.redirect("/");
    }
    else {
      res.render('list', {listtitle: today,items:fitems});
    }

  });

});

app.get("/:listName",function (req,res) {
  const ln=_.capitalize(req.params.listName);
  List.findOne({name:ln},function (err,result) {
    if(!err)
    {
      if(!result)
      {
        const list=new List({
          name:ln,
          listitem:[]
        });
        list.save();
        res.redirect("/"+ ln);
      }
    else {
      res.render("list",{listtitle:result.name,items:result.listitem})
    }
  }
  else {
    console.log(err);
  }


  });


});

app.post('/',function (req,res) {

    var itemName=req.body.newItem;
    const listname=req.body.list;  //listname is the name of the list we have ,we basically have two list one is the item collection and second is the list collection
    const item= Item(
      {
        name:itemName
      }
    );
    if(listname===today)
    {
      item.save(); //if we have the homepage tab opn then we will directly save the item and redirect to home page
      res.redirect('/');
    }
    else {
      List.findOne({name:listname},function (err,result) { //if not item list then we will first find on which list we are , then will add that item to that list.
        result.listitem.push(item);
        result.save();
        res.redirect("/"+listname);
      });
    }


});

app.post("/delete",function (req,res) {
  const deleteId=req.body.checkbox;
  const listname=req.body.whichList;
  if(listname===today)
  {
  Item.deleteOne({_id:deleteId},function (err) {
    if(err)
    console.log(err);
    else {
      res.redirect('/');
    }

  });
}
else {
  List.findOneAndUpdate({name:listname},{$pull:{listitem : {_id : deleteId }}},function (err,result) {
    if(!err)
    {
    res.redirect("/"+listname);
     }
     else {
       console.log(err);
     }
   });
}
});



app.listen(3000,function () {
  console.log("Server is working fine");
})

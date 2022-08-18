const express = require("express");
const app = express();
const _ = require("lodash");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogdb');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(publicDir));
app.set('view engine', 'ejs');

const blogschema = new mongoose.Schema({
  title: {type: String, required: [true,"Please enter the blog title"]},
  post: {type: String, required: [true,"Please enter the blog post"]}
})

const blog = mongoose.model("blog", blogschema);

const homecontent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutcontent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet volutpat consequat mauris nunc congue nisi. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Adipiscing vitae proin sagittis nisl rhoncus. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.";
const contactcontent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas sed tempus urna et pharetra.";

app.get("/",function(req,res)
{
  blog.find({}, function(err, founditems)
{
    res.render("home", {T: founditems});
})

})

app.post("/delete", function(req,res)
{
  blog.deleteOne({title: req.body.t},function(err)
{
  res.redirect("/");
})

})

app.get("/about",function(req,res)
{
  res.render("about", {title: "About Us", content: aboutcontent});
})

app.get("/contact",function(req,res)
{
  res.render("contact", {title: "Contact Us", content: contactcontent});
})

app.get("/compose",function(req,res)
{
  res.render("compose")
})

app.get("/posts/:postno", function(req,res)
{
  const reqtitle = _.lowerCase(req.params.postno);

  blog.findOne({title: reqtitle}, function(err, found)
{
  if(err)
  console.log(err);
  else{
    res.render("fullpage", {title: found.title, post: found.post})
  }
})

})

app.post("/compose",function(req,res)
{
  const newblog = new blog({
    title: (req.body.newtitle),
    post: (req.body.newpost)
  })
  newblog.save();
  res.redirect("/");

})

app.listen(3000,function()
{
  console.log("Server is running on port 3000");
})

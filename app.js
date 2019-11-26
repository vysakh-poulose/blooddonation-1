var express     = require('express');
var bodyParser    = require('body-parser');
var mysql = require('mysql');
var session    = require('client-sessions');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("front_end/"));


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
    database : 'asd_project',
    insecureAuth : true
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("DB Connected!");
  });

  app.use(session({
    cookieName: 'asd_session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  }));




  app.get("/",function(req,res){
    res.render('login.ejs');
});

app.post("/login",function(req,res){
  var q1 =   "SELECT pass FROM USER WHERE user_id= '" + req.body.uid + "'";
  console.log(q1);
  con.query(q1, function (err, result, fields) {
    if (err) throw err;
    console.log(result.length);
    if(result.length==0){
      console.log("Invalid UID");
    }else{
      if(req.body.pass==result[0].pass){
        console.log("USER EXISTS");
        req.asd_session.user = req.body.uid;
        res.redirect('/home');
      }else{
        console.log("INVALID PASSWORD")
      }
    }
  });
});

app.get('/home',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var q1 =   "SELECT f_name,l_name FROM USER WHERE user_id= '" + req.asd_session.user + "'";
    console.log(q1);
    con.query(q1,function(err,result,fields){
      if (err) throw err;
      res.render('home.ejs',{
        obj:result[0]
      });
    });
    
  }
  
});

app.get('/register',function(req,res){
    res.render('register.ejs');
});


app.get('/results',function(req,res){
  
  res.render('result.ejs');
})


app.post('/register',function(req,res){
  var location = req.body.location;
  var arr = location.split(',');
  var q1 = "INSERT INTO USER VALUES ( '" + req.body.first_name +"','"+ req.body.last_name +"','"+req.body.user_id+"',"+ arr[0] +",'"+ arr[1] +"','"+ req.body.email +"',"+ req.body.phone +",'"+ req.body.pass +"','"+ req.body.blood + "' )";
  console.log(q1);
  con.query(q1,function(err,result,fields){
    if (err) throw err;
    console.log("1 User Created\n");
    res.redirect('/home');
  });
});


app.post('/search',function(req,res){
  if(req.body.blood!="All Available"){
    var q1 = "SELECT * FROM USER WHERE blood = '" + req.body.blood +"' AND " + "pin = " + req.body.pin ;
    console.log(q1);
  con.query(q1,function(err,result,fields){
    if (err) throw err;
    res.render('result.ejs',{
      obj:result
    });
  });
  }else{
    var q2 = "SELECT * FROM USER WHERE pin = " + req.body.pin ;
    console.log(q2);
    con.query(q2,function(err,result,fields){
      if (err) throw err;
      res.render('result.ejs',{
        obj:result
      });
    });
  }
  
});

app.get('/profile',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var q1 = "SELECT * FROM USER WHERE user_id = '" + req.asd_session.user + "'";
    console.log(q1);
    con.query(q1,function(err,result,fields){
      if (err) throw err;  
      res.render('profile.ejs',{
        obj:result[0]
      });
    });
  }
});

app.get('/update',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var q1 = "SELECT * FROM USER WHERE user_id = '" + req.asd_session.user + "'";
    console.log(q1);
    con.query(q1,function(err,result,fields){
      if (err) throw err;
      res.render('profile_update.ejs',{
        obj:result[0]
      });
    });
  }
});

app.post('/upd_profile',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var q1 = "SELECT * FROM USER WHERE user_id = '" + req.asd_session.user + "'";
    var a = req.body.first_name;
    var b = req.body.last_name;
    var arr =req.body.location.split(',');
    var c = arr[0];
    var d = arr[1];
    var e = req.body.email;
    var f = req.body.phone;
    var g = req.body.blood;
    console.log(q1);
    con.query(q1,function(err,result,fields){
      if (err) throw err;
      var db_val = result[0];
      //firstname
      if(a==db_val.f_name){
        console.log("No change in First Name");
      }else{
        console.log("CHANGE EXISTS in First Name");
        var q2 = "UPDATE USER SET f_name = '" + a + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //secondname
      if(b==db_val.l_name){
        console.log("No change in Last Name");
      }else{
        console.log("CHANGE EXISTS in Last Name");
        var q2 = "UPDATE USER SET l_name = '" + b + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //pin
      if(c==db_val.pin){
        console.log("No change in Pin");
      }else{
        console.log("CHANGE EXISTS in Pin");
        var q2 = "UPDATE USER SET pin = '" + c + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //state
      if(d==db_val.state){
        console.log("No change in State");
      }else{
        console.log("CHANGE EXISTS in State");
        var q2 = "UPDATE USER SET state = '" + d + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //email
      if(e==db_val.email){
        console.log("No change in Email");
      }else{
        console.log("CHANGE EXISTS in Email");
        var q2 = "UPDATE USER SET email = '" + e + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //phone
      if(f==db_val.phone){
        console.log("No change in Phone");
      }else{
        console.log("CHANGE EXISTS in Phone");
        var q2 = "UPDATE USER SET phone = '" + f + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      //blood
      if(g==db_val.blood){
        console.log("No change in Blood");
      }else{
        console.log("CHANGE EXISTS in Blood");
        var q2 = "UPDATE USER SET blood = '" + g + "' WHERE user_id = '" + req.asd_session.user + "'";
        console.log(q2);
        con.query(q2, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      }
      con.query(q1,function(err,result,fields){
        if (err) throw err;
        res.render('profile.ejs',{
          obj:result[0]
        });
      });
    });
  }
});

app.get('/message-first',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    res.render('message_first.ejs');
  }
});



app.post('/selected_donor',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var donor = req.body.user_id;
    req.asd_session.donor = donor;
    var q1 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + donor + "'";
    console.log(q1);
    con.query(q1,function(err,result,fields){
      if (err) throw err;
      var name = result[0].f_name + " " + result[0].l_name;
      res.render('message_first.ejs',{name:name,donor:donor});
    });
  }
});



app.post('/first_msg',function(req,res){
  var user =req.asd_session.user;
  var donor=req.body.donor;
  var first;
  var second;
  var num = user.localeCompare(donor);
  if(num==1){
      first = donor;
      second = user;
  }else if(num==-1){
      first = user;
      second = donor;
  }
  var table_name = first+"_"+second;
  var q1 ="CREATE TABLE " + table_name + " (uid VARCHAR(30), msg VARCHAR(500) );"
  var q3 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + donor + "'";
  console.log(q3);
  con.query(q3,function(err,result,fields){
    if (err) throw err;
    var name = result[0].f_name + " " + result[0].l_name;
    console.log(name);
    console.log(q1);
    con.query(q1, function (err, result) {
      if (err){
        console.log("TABLE EXISTS");
        var q2 = "INSERT INTO " + table_name + " VALUES ('"+user+"' , '" + req.body.message + "')";
        console.log(q2);
        con.query(q2,function(err,result,fields){
          if (err) throw err;
          console.log("VALUE INSERTED");
          var q4 = "SELECT * from " + table_name;
          console.log(q4);
          con.query(q4,function(err,result,fields){
            if (err) throw err;
            res.render('message.ejs',{name:name, conv:result,donor:donor,user:user});
          });
        });
      }else{
        console.log("Table created");
        var q2 = "INSERT INTO " + table_name + " VALUES ('"+user+"' , '" + req.body.message + "')";
        console.log(q2);
        con.query(q2,function(err,result,fields){
          if (err) throw err;
          console.log("VALUE INSERTED");
          var q4 = "SELECT * from " + table_name;
          console.log(q4);
          con.query(q4,function(err,result,fields){
            if (err) throw err;
            res.render('message.ejs',{name:name, conv:result,donor:donor,user:user});
          });
        });
      }
      
    });

  });
});

app.post('/individual_msg',function(req,res){
  var user =req.asd_session.user;
  var donor=req.body.donor;
  var first;
  var second;
  var num = user.localeCompare(donor);
  if(num==1){
      first = donor;
      second = user;
  }else if(num==-1){
      first = user;
      second = donor;
  }
  var table_name = first+"_"+second;
  console.log(table_name);
  var q3 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + donor + "'";
  console.log(q3);
  con.query(q3,function(err,result,fields){
    if (err) throw err;
    var name = result[0].f_name + " " + result[0].l_name;
    console.log(name);
    var q2 = "INSERT INTO " + table_name + " VALUES ('"+user+"' , '" + req.body.msg + "')";
    console.log(q2);
    con.query(q2,function(err,result,fields){
      if (err) throw err;
      console.log("VALUE INSERTED");
      var q4 = "SELECT * from " + table_name;
      console.log(q4);
      con.query(q4,function(err,result,fields){
        if (err) throw err;
        res.render('message.ejs',{name:name, conv:result,donor:donor,user:user});
      });
    });
  });

});

app.get('/messages',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    var uid_array=[];
    var final_array=[];
    var present_arr=[];
    var user =req.asd_session.user;
    var query = "show tables;";
    console.log(query);
    con.query(query,function(err,result,fields){
      if (err) throw err;
      var table_name = result;
      for(var i=0;i<=table_name.length-1;i++){
        if(table_name[i]['Tables_in_asd_project'].includes(user)){
          present_arr.push(table_name[i]['Tables_in_asd_project']);
        }
      }
      for(var j=0;j<=present_arr.length-1;j++){
        var tmp_obj={};
        var s_uid = present_arr[j].replace(user,'');
        var s_uid_conf = s_uid.replace('_','');
        var q7 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + s_uid_conf + "'";
        console.log(q7);
        uid_array.unshift(s_uid_conf);
        con.query(q7,function(err,resultt,fields){
          if (err) throw err;
          // tmp_obj.f_name=resultt[0].f_name;
          // tmp_obj.l_name = resultt[0].l_name;
          var name = resultt[0].f_name + " " + resultt[0].l_name;
          // console.log(tmp_obj);
          final_array.unshift(name);
          // tmp_obj={};
        });

      }
      setTimeout(function(){
      res.render('message-list.ejs',{
        name:final_array,
        uid:uid_array
      });
      },1000);
      
    });
  }
  

})

app.post('/indiv_msggg',function(req,res){
  var user = req.asd_session.user;
  var donor=req.body.donor;
  var first;
  var second;
  var num = user.localeCompare(donor);
  if(num==1){
      first = donor;
      second = user;
  }else if(num==-1){
      first = user;
      second = donor;
  }
  var table_name = first+"_"+second;
  var q3 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + donor + "'";
  console.log(q3);
  con.query(q3,function(err,result,fields){
    if (err) throw err;
    var name = result[0].f_name + " " + result[0].l_name;
    console.log(name);
      var q4 = "SELECT * from " + table_name;
      console.log(q4);
      con.query(q4,function(err,result,fields){
        if (err) throw err;
        res.render('message.ejs',{name:name, conv:result,donor:donor,user:user});
      });
  });

});


app.post('/indiv_msg',function(req,res){
  var user = req.asd_session.user;
  var donor=req.body.donor;
  var first;
  var second;
  var num = user.localeCompare(donor);
  if(num==1){
      first = donor;
      second = user;
  }else if(num==-1){
      first = user;
      second = donor;
  }
  var table_name = first+"_"+second;
  var q3 = "SELECT f_name,l_name FROM USER WHERE user_id = '" + donor + "'";
  console.log(q3);
  con.query(q3,function(err,result,fields){
    if (err) throw err;
    var name = result[0].f_name + " " + result[0].l_name;
    console.log(name);
    var q2 = "INSERT INTO " + table_name + " VALUES ('"+user+"' , '" + req.body.msg + "')";
    console.log(q2);
    con.query(q2,function(err,result,fields){
      if (err) throw err;
      console.log("VALUE INSERTED");
      var q4 = "SELECT * from " + table_name;
      console.log(q4);
      con.query(q4,function(err,result,fields){
        if (err) throw err;
        res.render('message.ejs',{name:name, conv:result,donor:donor,user:user});
      });
    });
  });

});



app.get('/logout',function(req,res){
  if (!req.asd_session.user) {
    res.redirect('/');
  } else {
    req.asd_session.reset();
    res.redirect("/");
  }
});

  app.listen(process.env.PORT || 5001, function() {
    console.log("Server Started");
  });

  


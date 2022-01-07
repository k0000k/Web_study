var http = require('http');
var fs = require('fs');
var url=require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template=require('./lib/template.js');

var express = require('express');
var app = express();

var server=http.createServer(app)
const port=process.env.PORT;

app.use('/css', express.static('./public/css'));
app.use('/image', express.static('./public/image'));
app.use('/js', express.static('./public/js'));

app.get('/', function(request,response){
    var _url = request.url;
    var queryData=url.parse(_url,true).query;
    var title=queryData.id;
    var pathname = url.parse(_url, true).pathname;

    if (pathname==='/'){
      if (queryData.id===undefined){
        fs.readFile(`data/index.html`, 'utf8', function(err, description){
          var template=`${description}`;
          response.writeHead(200);
          response.end(template);
        });
      } else if(queryData.id==='charmander'){
        fs.readFile(`data/charmander.html`, 'utf8', function(err, description){
          var template=`${description}`;
          response.writeHead(200);
          response.end(template);
        });
      }
      else {
        fs.readdir('./description_data', function(err,filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`description_data/${filteredId}.html`, 'utf8', function(err, description){
            var title=queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1','h2','h3','a','p','br','strong','u','hr','img','div','link','html','head','body']
            });
            var list = template.list(filelist);
            var html=template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
          );
            response.writeHead(200);
            response.end(html);
      });
    });
    }
  }

  app.use("/create",function(req,res,next) {
    fs.readdir('./description_data', function(err, filelist){
      var title = 'create - Web study';
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
        <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `,'');
	res.writeHead(200);
	res.end(html);
})});

app.use("/create_process",function(req,res,next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
    req.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`description_data/${title}.html`, description, 'utf8',function(err){
        res.writeHead(302, {Location:`/?id=${title}`});
        res.end();
      })
    });
});

app.use("/update",function(req,res,next) {
  fs.readdir('./description_data', function(err,filelist){
    var _url = req.url;
    var queryData=url.parse(_url,true).query;
    var filteredId = path.parse(queryData.id).base;
    fs.readFile(`description_data/${filteredId}.html`, 'utf8', function(err, description){
      var title=queryData.id;
      var list = template.list(filelist);
      var html=template.HTML(title, list,
        `
        <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    );
      res.writeHead(200);
      res.end(html);
});
});
});

app.use("/update_process",function(req,res,next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`description_data/${id}.html`, `description_data/${title}.html`, function(err){
        fs.writeFile(`description_data/${title}.html`, description, 'utf8', function(err){
          res.writeHead(302, {Location: `/?id=${title}`});
          res.end();
        })
      });
  });
});

app.use("/delete_process",function(req,res,next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`description_data/${filteredId}.html`, function(err){
        res.writeHead(302, {Location: `/`});
        res.end();
      })
  });
});
  /*
  else {
    response.writeHead(404);
    response.end('Not found');
  }
  */
});
app.listen(port);

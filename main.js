var http = require('http');
var fs = require('fs');
var url=require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template=require('./lib/template.js');

var express = require('express');
var _app = express();

var server=http.createServer(app)

_app.use('/css', express.static('./public/css'));
_app.use('/image', express.static('./public/image'));
_app.use('/js', express.static('./public/js'));

//이 부분은 express 모듈 이용해서 CSS와 Javascript 적용 시도한 부분이지만 보류!
//주석부분처럼 app.get으로 접속하면 CSS와 Javascript가 정상 작동하지만 create과 update에 접속시 cannot get/ 오류 발생
//현재 코드는 create과 update는 정상 작동하지만, CSS, Javascript 파일이 불러와지지 않음


var app = http.createServer(function(request,response){
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
  else if(pathname==='/create'){
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
      response.writeHead(200);
      response.end(html);
  });
} else if(pathname==='/create_process'){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`description_data/${title}.html`, description, 'utf8',function(err){
        response.writeHead(302, {Location:`/?id=${title}`});
        response.end();
      })
    });
  } else if (pathname==='/update') {
    fs.readdir('./description_data', function(err,filelist){
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
        response.writeHead(200);
        response.end(html);
  });
});
  } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`description_data/${id}.html`, `description_data/${title}.html`, function(err){
            fs.writeFile(`description_data/${title}.html`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`description_data/${filteredId}.html`, function(err){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000)});

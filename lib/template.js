
module.exports={
  HTML:function (title, list, body, control){
    return `
    <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>${title} - Web study</title>
            <link rel="stylesheet" href="/css/page_style.css">

            <script src="/js/color.js"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
            </head>

            <body>
            <h1><a href="/" id="title">Web</a></h1>

            <div id="body">
            <div id="list">
            ${list}
            </div>
            <div id="article">
            주간모드/야간모드 전환: <input type="button" value="night" onclick="daynight(this);">
            <br><br>${control}
            ${body}
            </div>
            </div>

            <p style="margin-top:80px;">
            <p><div id="disqus_thread"></div>
            <script>
                /**
                *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
                *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
                /*
                var disqus_config = function () {
                this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
                this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
                };
                */
                (function() { // DON'T EDIT BELOW THIS LINE
                var d = document, s = d.createElement('script');
                s.src = 'https://https-github-com-k0000k-web-study.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
                })();
            </script>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript></p>
            </body>
            </html>
            `;
  }, list:function (filelist){
    var list='<ul>';
    var i=0;
    while (i<filelist.length) {
      var file = filelist[i].substring(0, filelist[i].length-5);
      list = list + `<li><a href="/?id=${file}">${file}</a></li>`;
      i=i+1;
    }
    list=list+'</ul>'
    return list;
  }

}

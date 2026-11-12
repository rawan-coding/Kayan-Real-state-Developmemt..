/* كيان للتطوير العقاري - القائمة والبحث والتنقل ونسخ الأرقام */
(function(){
  var header=document.getElementById('top-bar');
  var menuBtn=document.getElementById('menu-btn');
  var searchBtn=document.getElementById('search-btn');
  var pop=document.getElementById('search-pop');
  var input=document.getElementById('search-input');
  var msg=document.getElementById('search-msg');

  function onScroll(){header.classList.toggle('scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  function setMenu(open){header.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',open?'true':'false')}
  menuBtn.addEventListener('click',function(){setMenu(!header.classList.contains('open'))});
  document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  function setSearch(open){pop.hidden=!open;searchBtn.setAttribute('aria-expanded',open?'true':'false');if(open){input.focus()}}
  searchBtn.addEventListener('click',function(){setSearch(pop.hidden)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setSearch(false);setMenu(false)}});

  var norm=function(s){return s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim()};
  var sections=[].slice.call(document.querySelectorAll('[data-searchable]')).map(function(el){return {el:el,title:el.getAttribute('data-title'),text:norm(el.textContent)}});
  document.getElementById('search-form').addEventListener('submit',function(e){
    e.preventDefault();
    var q=norm(input.value);
    if(!q){msg.textContent='اكتب كلمة للبحث.';return}
    var hit=sections.filter(function(s){return s.text.indexOf(q)>-1})[0];
    if(!hit){msg.textContent='لا توجد نتائج لهذه الكلمة.';return}
    msg.textContent='تم الانتقال إلى: '+hit.title;
    hit.el.scrollIntoView({behavior:'smooth',block:'start'});
    hit.el.classList.remove('mark-hit');void hit.el.offsetWidth;hit.el.classList.add('mark-hit');
    setSearch(false);
  });

  var links={};document.querySelectorAll('[data-link]').forEach(function(a){links[a.getAttribute('data-link')]=a});
  function setActive(id){Object.keys(links).forEach(function(k){if(k===id){links[k].setAttribute('aria-current','true')}else{links[k].removeAttribute('aria-current')}})}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){setActive(en.target.getAttribute('data-nav'))}})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('[data-nav]').forEach(function(s){io.observe(s)});
  }

  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var done=function(t){b.textContent=t;setTimeout(function(){b.textContent='نسخ'},1800)};
      var fallback=function(){
        try{var n=b.previousElementSibling,r=document.createRange();r.selectNodeContents(n);var s=window.getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}
        done('حدد الرقم وانسخه');
      };
      try{navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function(){done('تم النسخ')},fallback)}catch(e){fallback()}
    });
  });
})();
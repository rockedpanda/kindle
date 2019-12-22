var cacheReq = {
    cache: {},
    get: function(url){
        return this.cache[url] ||null;
    },
    set: function(url, data){
        this.cache[url] = data;
    },
    del: function(url){
        this.cache[url] = undefined;
        delete this.cache[url];
    },
    delAll: function(){
        this.cache = {};
    }
};


var vm = new Vue({
    el:'#main',
    data:function(){
        return {
            path:'rockedpanda/kindle/contents',
            list: [],
            content:'',
            mode:'list',
            url:'',
            favs:['rockedpanda/kindle/contents'],
            showFav:false,
        };
    },
    methods: {
        goPage:function(item){
            this.mode = item.type==='dir'?'list':'detail';
            // window.location.href = this.getTarget(item);
            this.showInfo(item);
        },
        skip:function(i){
            this.mode='list';
            if(i<2){
                return;
            }
            this.showList('https://api.github.com/repos/'+this.dirs.slice(0,i+1).join('/'));
            //window.location.href = 'index.html#path=https://api.github.com/repos/' +this.dirs.slice(0,i+1).join('/');
        },
        getTarget:function(item){
            return item.type==='dir'?(''+encodeURI(item.url)) : (''+encodeURI(item.download_url));
        },
        goPath:function(){
            if(this.path.split('/').length==2){
                this.path = this.path+'/contents';
            }
            this.showPath();
            //window.location.href="index.html#path="+encodeURI('https://api.github.com/repos/'+this.path);
        },
        showDetail: function(url){
            this.url = url;
            // var url = this.getTarget(item);// decodeURI(document.location.hash.replace('#path=',''));
            this.mode = 'detail';
            this.content = '';
            this.list=[];
            if(cacheReq.get(url)){
                vm.content = cacheReq.get(url);
                return;
            }
            $.get(url).then(function(d){
                vm.content = d;
                cacheReq.set(url, d);
            });
        },
        showList: function(url){
            this.url = url;
            //var url = this.getTarget(item);// decodeURI(document.location.hash.replace('#path=','')) || 'https://api.github.com/repos/rockedpanda/kindle/contents';
            this.path = url.replace('https://api.github.com/repos/','');
            this.mode = 'list';
            this.content = '';
            this.list=[];
            if(cacheReq.get(url)){
                vm.list = cacheReq.get(url).slice(0);
                return;
            }
            $.get(url).then(function(d){
                var ans = d.sort(function(a,b){
                    return (a.type < b.type || a.name < b.name)?-1:1;
                });
                cacheReq.set(url, ans.slice(0));
                vm.list = ans.slice(0);
            });
        },
        showInfo: function(item){
            if(typeof item=='string'){
                this.showList(item);
            }else if(this.mode=='list'){
                this.showList(this.getTarget(item));
            }else{
                this.showDetail(this.getTarget(item));
            }
        },
        back: function(){
            this.url = this.url.split('/').slice(0,-1).join('/');
            this.showList('https://api.github.com/repos/'+this.dirs.join('/'));
        },
        showPath:function(path){
            if(path){
                this.path = path;
            }
            this.showList('https://api.github.com/repos/'+this.path);
        },
        addFav:function(){
            this.favs.push(this.path+'');
            localStorage.setItem('favs',JSON.stringify(this.favs));
        },
        goFav:function(fav){
            this.path = fav;
            this.showPath();
        },
        delFav:function(index){
            var ans = window.confirm('是否移除收藏:'+this.favs[index]);
            if(!ans){return;}
            this.favs.splice(index,1);
            localStorage.setItem('favs',JSON.stringify(this.favs));
        }
    },
    mounted: function() {
        // if(document.location.hash.length<2){
        //     document.location.hash = '#path=https://api.github.com/repos/rockedpanda/kindle/contents';
        // }
        this.showInfo('https://api.github.com/repos/rockedpanda/kindle/contents');
        this.favs = JSON.parse(localStorage.getItem('favs')||'[]');
    },
    computed: {
        dirs: function(){
            var index = this.path.indexOf('?');
            if(index!==-1){
                return this.path.slice(0, index).split('/');
            }
            return this.path.split('/');
        }
    },
});

window.addEventListener('hashchange', function (e) { 
    // console.log(e.oldURL);
    // console.log(e.newURL)
    if(e.oldURL.indexOf('raw.github')!==-1){
        vm.mode='list';
    }
    vm.showInfo('https://api.github.com/repos/rockedpanda/kindle/contents');
  }, false)

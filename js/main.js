var vm = new Vue({
    el:'#main',
    data:function(){
        return {
            path:'rockedpanda/kindle/contents',
            list: [],
            content:'',
            mode:'list'
        };
    },
    methods: {
        goPage:function(item){
            this.mode = item.type==='dir'?'list':'detail';
            window.location.href = this.getTarget(item);
            //this.showInfo();
        },
        skip:function(i){
            this.mode='list';
            if(i<2){
                return;
            }
            window.location.href = 'index.html#path=https://api.github.com/repos/' +this.dirs.slice(0,i+1).join('/');
        },
        getTarget:function(item){
            return item.type==='dir'?('index.html#path='+encodeURI(item.url)) : ('index.html#path='+encodeURI(item.download_url));
        },
        goPath:function(){
            if(this.path.split('/').length==2){
                this.path = this.path+'/contents';
            }

            window.location.href="index.html#path="+encodeURI('https://api.github.com/repos/'+this.path);
        },
        showDetail: function(){
            var url = decodeURI(document.location.hash.replace('#path=',''));
            this.mode = 'detail';
            this.content = '';
            this.list=[];
            $.get(url).then(function(d){
                vm.content = d;
            });
        },
        showList: function(){
            var url = decodeURI(document.location.hash.replace('#path=','')) || 'https://api.github.com/repos/rockedpanda/kindle/contents';
            this.path = url.replace('https://api.github.com/repos/','');
            this.mode = 'list';
            this.content = '';
            this.list=[];
            $.get(url).then(function(d){
                vm.list = d.sort(function(a,b){
                    return (a.type < b.type || a.name < b.name)?-1:1;
                });
            });
        },
        showInfo: function(){
            if(this.mode=='list'){
                this.showList();
            }else{
                this.showDetail();
            }
        }
    },
    mounted: function() {
        if(document.location.hash.length<2){
            document.location.hash = '#path=https://api.github.com/repos/rockedpanda/kindle/contents';
        }
        this.showInfo();
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
    vm.showInfo();
  }, false)

var vm = new Vue({
    el:'#main',
    data:function(){
        return {
            path:'rockedpanda/kindle/contents',
            list: []
        };
    },
    methods: {
        getTarget:function(item){
            return item.type==='dir'?('index.html?path='+encodeURI(item.url)) : ('detail.html?path='+encodeURI(item.download_url));
        },
        goPath:function(){
            if(this.path.split('/').length==2){
                this.path = this.path+'/contents';
            }
            window.location.href="index.html?path="+encodeURI('https://api.github.com/repos/'+this.path);
        }
    },
    mounted: function() {
        var url = decodeURI(document.location.search.replace('?path=','')) || 'https://api.github.com/repos/rockedpanda/kindle/contents';
        $.get(url).then(function(d){
            vm.list = d;
        });
    },
});

var vm = new Vue({
    el:'#main',
    data:function(){
        return {
            list: []
        };
    },
    methods: {
        getTarget:function(item){
            return item.type==='dir'?('index.html?path='+encodeURI(item.url)) : ('detail.html?path='+encodeURI(item.download_url));
        }
    },
    mounted: function() {
        var url = decodeURI(document.location.search.replace('?path=','')) || 'https://api.github.com/repos/rockedpanda/kindle/contents';
        $.get(url).then(function(d){
            vm.list = d;
        });
    },
});

var vm = new Vue({
    el:'#main',
    data:function(){
        return {
            content: ''
        };
    },
    methods: {
        getTarget:function(item){
            return item.type==='dir'?('index.html?path='+encodeURI(item.url)) : ('detail.html?path='+encodeURI(item.url));
        }
    },
    mounted: function() {
        var url = decodeURI(document.location.search.replace('?path=',''));
        $.ajax({
            url: url,
            dataType: 'text'
          }).then(function(d){
            vm.content = d;
        });
    },
});

(function($){
    $.segment = function(){
        $('.mg-segment').on('click','.mg-tab li',function(e){
            var targetId = this.getAttribute("target");
            for(var key in this.parentNode.children){
                this.parentNode.children[key].className = "";
            }
            this.className = "active";
            $('.mg-segment .mg-tab-content').each(function(i,dom){
                if(dom.id == targetId){
                    dom.className = "mg-tab-content active";
                } else {
                    dom.className = "mg-tab-content";
                }
            });
        });
    }
    $.segment();
})(mgui)
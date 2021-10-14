/*
    以对象形式封装，跨浏览器处理程序
        obj表示事件对象，name表示事件名不带on，fun表示函数
*/ 
let com={
    // 添加事件
    add:function(obj,name,fun){
        if(obj.attachEvent){
            obj.attachEvent('on'+name,fun);
        }else if(obj.addEventListener){
            obj.addEventListener(name,fun,false);
        }else{
            obj['on'+name]=fun;
        }
    },
    // 删除事件
    delev:function(obj,name,fun){
        if(obj.attachEvent){
            obj.detachEvent('on'+name,fun);
        }else if(obj.addEventListener){
            obj.removeEventListener(name,fun,false);
        }else{
            obj['on'+name]= null;
        }
    },
    // 阻止冒泡
    stopBubble:function(e){
        e = e||event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }else{
            e.cancelBubble=true;
        }
    },
    // 阻止默认行为
    stopDefault:function(e){
        e = e || event;
        if (e.preventDefault) {
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
        //return false;
    },
    /*事件代理
        ancestorsId祖先的id及谁来代理,type怎么触发及什么事件,
        clsName被代理的节点样式名(用的样式包含),fun函数
    */ 
    agent:function(ancestorsId,type,clsName,fun){
        let ancestors=document.getElementById(ancestorsId);
        // 样式
        this.add(ancestors,type,function(e){
            e =e||event;
            let target=e.target||e.srcElement;//获取目标对象
            let targetId=target.getAttribute('id');

            // 如果没有找到目标并且当前目标不是祖先对象，继续循环
            while(!target.classList.contains(clsName) && targetId != ancestorsId){
                target=target.parentNode;
                targetId=target.getAttribute('id');
            }
            if (target.classList.contains(clsName)) {
                fun.call(target);
                // 给target节点绑定一个fun方法,fun中的this是target
            }
        })
    },
    agent1:function(ancestorsId,type,chileName,fun){
        let ancestors=document.getElementById(ancestorsId);
        // 标签ancestorsId  id名字
        this.add(ancestors,type,function(e){
            e =e||event;
            let target=e.target||e.srcElement;//获取目标对象
            let targetId=target.getAttribute('id');

            // 如果没有找到目标并且当前目标不是祖先对象，继续循环
            while(target.nodeName.toLowerCase()!=chileName && targetId != ancestorsId){
                target=target.parentNode;
                targetId=target.getAttribute('id');
            }
            if (target.nodeName.toLowerCase()===chileName) {
                fun.call(target);
                // 给target节点绑定一个fun方法,fun中的this是target
            }
        })
    },
    agent2:function (parent,type,childName,fun) {   //type事件名字  className类名 parent父元素id
        this.add(parent,type,function (e) {
            e=e||event;
            let target=e.target||e.srcElement;      //兼容IE和非IE
            //如果没有找到目标并且当前目标不是祖先对象，继续找（循环）
            while(target.nodeName.toLowerCase()!=childName && target.nodeName!=parent.nodeName){
                target=target.parentNode;       //寻找上一级父节点
            }
            if (target.nodeName.toLowerCase()===childName){      //找到了目标对象
                fun.call(target)        //回调，把fun这个函数绑定到target上，fun中的this就是target
                                        //call能把一个方法绑定到节点上
            }
        })
    },
    /*
        清除样式，els含该样式的数组，clsName清除的样式
    */ 
    clearCls:function(els,clsName){
        for (let i = 0; i < els.length; i++) {
            if(els[i].classList.contains(clsName)){
                els[i].classList.remove(clsName);
            }  
        }
    },
    /*
       移除元素,el删除的元素名
    */ 
    remove:function(el){
        var toRemove = document.querySelector(el);
        toRemove.parentNode.removeChild(toRemove);
    },
    /*
        获取obj超出的大小
    */ 
    getScroll:function(obj){
        let top = 0;
        let left = 0;
        if(obj == document){
            top = obj.documentElement.scrollTop || obj.body.scrollTop;
            left = obj.documentElement.scrollLeft || obj.body.scrollLeft;    
        }else{
            top = obj.scrollTop;
            left = obj.scrollLeft;
        }
        return{
            left: left,
            top: top
        }
        // json中的属性名和值一样可以简写{left,top}
    },
    getWinWH:function(){
        // 窗口可视区高度不包含滚动条
        let width = document.documentElement.offsetWidth || document.body.offsetWidth;
        let height =  document.documentElement.offsetHeight || document.body.offsetHeight;

        return {width:width,height:height}
    },
    getWinInnerWH:function(){
        // 窗口可视区高度包含滚动条(17px)
        let width = window.innerWidth;
        let height =  window.innerHeight;

        return {width:width,height:height}
    },
    getDocWH:function(){
        // 获取文档的高宽
        let width = document.documentElement.scrollWidth || document.body.scrollWidth;
        let height = document.documentElement.scrollHeight || document.body.scrollHeight;

        return {width,height}
    }
};
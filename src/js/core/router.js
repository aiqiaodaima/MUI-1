/**
 * @author : matthewsun
 * @mail : matthew-sun@foxmail.com
 * @description : MUI框架的路由控制
 * @date : 2014/10/21
 */
define(function(require, exports, module){
    var $ = require('../zepto/zepto');
    var func = require('./func');
    var itpl = require('./itpl');

    var Router = func.Class({

        init : function(dirPath) {
            this.dirPath = dirPath || '../src/js/';
            this.onHashChange();
        },

        /**
         * 路径缓存
         * 
         * @type {Object}
         */
        
        cache : {} ,

        /**
         * 路由控制
         * 
         * @param  {[type]} path    hash地址
         * @param  {[type]} options {
         *                              templateUrl : ?
         *                              templateData : ? 
         *                              controller : ?
         *                           }
         * 
         * @return {[type]}         router对象
         */
        
        when : function(path, options) {

            this.cache[path] = options;

            this.load(path);

            return this;
        },

        otherwise : function(options) {

            this.cache['otherwiseSpecialTpl'] = options;
            this.load('otherwiseSpecialTpl');

            return this;
        },

        /**
         * page加载
         * 
         * @param  {[type]} path 路径
         */
        
        load : function(path) {
            var hash = location.hash;

            if( hash.substring(0,2) !== '#/' ) {
                location.hash = '#/';
            }

            // hash值不在缓存列表里，执行otherwise跳转
            if( !this.cache[location.hash.substring(1)] ) {
                if( this.cache['otherwiseSpecialTpl'] ) {
                    this.render('otherwiseSpecialTpl');
                }
                return ;
            }

            // 当前hash不是当前匹配的path，return
            if( !this.isHash(path) ) {
                return ;
            }

            this.render(path);

        },

        /**
         * 渲染摸板
         * 
         * @param  {[type]} path 路径
         */
        
        render : function(path) {

            var $view = $('#mui_view');
            var data = this.cache[path].templateData;
            var me = this;

            me.loading();

            $.get(this.dirPath + this.cache[path].templateUrl,
                function(response){
                    var renderHtml = itpl(response,data);
                    $view.html( renderHtml );

                    me.cache[path].controller && me.cache[path].controller();
                }
            )
        },

        /**
         * 获取模板数据
         * 
         * @param  {[type]} path 路径
         * @return {[type]}      html模板
         */
        
        fetchTpl : function(path) {
            var me = this;
            $.get(this.dirPath + me.cache[path].templateUrl,
                function(response){
                    return response;
                }
            )
        },

        /**
         * 数据改变时重新渲染模板
         * 
         * @param  {[type]} path 路径
         * @param  {[type]} data 新的数据
         */
        
        dataChangeReload : function(path, data) {
            this.cache[path].templateData = data;
            this.load(path);
        },

        /**
         * 判断当前hash与路径是否匹配
         * 
         * @param  {[type]}  path 路径
         * @return {Boolean}      真假值
         */
        
        isHash : function(path) {
            var hash = location.hash;

            return !!(hash.substring(1) === path)
        },

        /**
         * 绑定hashchange事件
         */
        
        onHashChange : function() {
            var me = this;

            window.addEventListener('hashchange',function() {
                me.load(location.hash.substring(1));
            },false)
        },

        /**
         * loading 转场等待渲染页面
         */
        loading : function() {
            var $view = $('#mui_view');
            var loadingHtml = '<div class="loading_view"></div>';

            $view.html(loadingHtml);
        }

    });
    
    return Router;
    
})
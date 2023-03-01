var EnvyWidget = function() { this.serverUrl = "https://whitesaas.com", this.staticServerUrl = "https://cdn.envybox.io", this.whiteSaasCode = window.whitesaas_code, this.localStoragePrefix = "WhiteSaas_" };
EnvyWidget.prototype.init = function() {
    var _this = this;
    if (this.frameCheck()) {
        if ("object" == typeof document.EW) return void console.log("zOnly one instance of EnvyWidget can be run");
        document.EW = this
    } else {
        if ("object" == typeof window.top.EW) return void console.log("Only one instance of EnvyWidget can be run");
        window.top.EW = this
    }
    return window.whitesaas_code || this.parseCode(), !window.whitesaas_code && window.callbackkiller_code && (window.whitesaas_code = window.callbackkiller_code), this.whiteSaasCode = window.whitesaas_code, this.removeOldValuesFromLocalStorage(), this.initSettings(), this.whiteSaasCode ? this.checkBot() ? void console.log("bot") : (document.referrer && "" != document.referrer && !this.getLocalStorageItem("WhiteSaas_referrer") && this.setLocalStorageItem("WhiteSaas_referrer", document.referrer, 60), void _this.loadSettings(_this)) : void console.log("whiteSaasCode required")
}, EnvyWidget.prototype.frameCheck = function() { try { return window != window.top || document != top.document || window.location != top.location } catch (e) { return !0 } }, EnvyWidget.prototype.initSettings = function() { "object" == typeof window.WBK_Settings && (window.WBK_Settings.serverUrl && (this.serverUrl = window.WBK_Settings.serverUrl), window.WBK_Settings.staticServerUrl && (this.staticServerUrl = window.WBK_Settings.staticServerUrl), window.WBK_Settings.whiteSaasCode && (this.whiteSaasCode = window.WBK_Settings.whiteSaasCode)) }, EnvyWidget.prototype.loadSettings = function(context, visitorHash) {
    var _this = context,
        url = _this.serverUrl + "/api?";
    try { JSON.stringify || "undefined" == typeof JSON.encode || (JSON.stringify = JSON.encode), JSON.parse || "undefined" == typeof JSON.decode || (JSON.parse = JSON.decode) } catch (e) {}
    _this.jsonp(url + _this.getLoadParams(visitorHash), function(result) { _this.scriptInit(result) })
}, EnvyWidget.prototype.scriptInit = function(data) {
    var url = data.Settings.widgetUrl;
    this.getScript(url, function() { var settings = { whiteSaasCode: this.whiteSaasCode }; "object" == typeof window.WBK_Settings && jWS.extend(settings, window.WBK_Settings), jWS().WBK(settings, data) })
}, EnvyWidget.prototype.getLoadParams = function(visitorHash) {
    var siteUrl = "";
    document.URL && (siteUrl = encodeURIComponent(document.URL));
    var _platform;
    try { _platform = navigator.platform } catch (e) {}
    var referrer = this.getLocalStorageItem("WhiteSaas_referrer"),
        params = { action: "load", code: this.whiteSaasCode, url: siteUrl, referrer: referrer ? encodeURIComponent(referrer) : "", cookie: this.getAllCookies(), visit_count: this.getVisitCount(), visitorId: !!this.getCookie("WhiteCallback_visitorId") && this.getCookie("WhiteCallback_visitorId"), platform: _platform, quizId: window.quizId ? window.quizId : null };
    return this.param(params)
}, EnvyWidget.prototype.param = function(params) { var str = ""; for (var key in params) params.hasOwnProperty(key) && ("" != str && (str += "&"), str += key + "=" + encodeURIComponent(params[key])); return str }, EnvyWidget.prototype.getCookie = function(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?",
        regexp = new RegExp(pattern);
    return regexp.test(document.cookie) ? decodeURIComponent(RegExp.$1) : null
}, EnvyWidget.prototype.jsonp = function(url, callback) {
    var callbackName = "jsonp_callback_" + Math.round(1e5 * Math.random());
    window[callbackName] = function(data) { delete window[callbackName], document.body.removeChild(script), callback(data) };
    var script = document.createElement("script");
    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + callbackName, document.body.appendChild(script)
}, EnvyWidget.prototype.getScript = function(source, callback) {
    var el = document.createElement("script");
    el.onload = callback, el.src = source, el.charset = "utf-8", document.body.appendChild(el)
}, EnvyWidget.prototype.scriptInit = function(data) {
    var _this = this,
        url = data.Settings.widgetUrl;
    this.getScript(url, function() { var settings = { whiteSaasCode: _this.whiteSaasCode }; "object" == typeof window.WBK_Settings && jWS.extend(settings, window.WBK_Settings), jWS().WBK(settings, data) })
}, EnvyWidget.prototype.getAllCookies = function() {
    for (var cookie = document.cookie.split("; "), all = [], i = 0; i < cookie.length; i++)
        if ("string" == typeof cookie[i])
            if (0 === cookie[i].search(/WhiteCallback_openedpage/) || 0 === cookie[i].search(/sw_openedpage/));
            else {
                var _str = cookie[i];
                all.push(_str.substring(0, 64))
            }
    return all.join("; ")
}, EnvyWidget.prototype.getVisitCount = function() { return parseInt(this.getStorage("ws_visit_count")) ? parseInt(this.getStorage("ws_visit_count")) : 0 }, EnvyWidget.prototype.checkBot = function() { if (/mtproxy\.yandex\.net/.test(document.URL)) return !0; try { if (/webvisor\.com/.test(window.parent.location.hostname)) return !0 } catch (e) {} return !1 }, EnvyWidget.prototype.parseQuery = function(query) {
    var params = new Object;
    if (!query) return params;
    for (var pairs = query.split(/[;&]/), i = 0; i < pairs.length; i++) {
        var keyVal = pairs[i].split("=");
        if (keyVal && 2 === keyVal.length) {
            var key = unescape(keyVal[0]),
                val = unescape(keyVal[1]);
            val = val.replace(/\+/g, " "), params[key] = val
        }
    }
    return params
}, EnvyWidget.prototype.parseCode = function() {
    for (var scripts = document.getElementsByTagName("script"), i = scripts.length; i--; i >= 0)
        if (!window.whitesaas_code) {
            var whitecallbackScript = scripts[i],
                whitecallbackScriptQueryString = whitecallbackScript.src.replace(/^[^\?]+\??/, ""),
                whitecallbackScriptParams = this.parseQuery(whitecallbackScriptQueryString);
            whitecallbackScriptParams.wcb_code ? (window.whitesaas_no_maps = null !== whitecallbackScript.getAttribute("nomaps"), window.whitesaas_no_cookie_page = null !== whitecallbackScript.getAttribute("nopagesettings") || null !== whitecallbackScriptParams.nopagesettings, window.whitesaas_code = whitecallbackScriptParams.wcb_code) : whitecallbackScriptParams.cbk_code && (window.whitesaas_no_maps = null !== whitecallbackScript.getAttribute("nomaps"), window.whitesaas_no_cookie_page = null !== whitecallbackScript.getAttribute("nopagesettings") || null !== whitecallbackScriptParams.nopagesettings, window.whitesaas_code = whitecallbackScriptParams.cbk_code)
        }
}, EnvyWidget.prototype.getJSON = function(url, params, callback, callbackErr) {
    params && (url = url + "?" + this.objectToUrl(params));
    var xhr = new XMLHttpRequest;
    xhr.onload = function() {
        var response = null;
        if (xhr.response) {
            response = xhr.response;
            var regexp = new RegExp("^" + params.callback + "\\(");
            response = response.replace(regexp, ""), response = response.replace(/.{2}$/, ""), response = JSON.parse(response)
        }
        callback && "function" == typeof callback && callback(response), 200 !== xhr.status && callbackErr && "function" == typeof callbackErr && callbackErr(response)
    }, xhr.open("GET", url, !0), xhr.send()
}, EnvyWidget.prototype.setCookie = function(name, value, expires, path, domain, secure) {
    if (!name || !value) return !1;
    path || (path = "/");
    var str = name + "=" + encodeURIComponent(value);
    return expires && (str += "; expires=" + expires.toGMTString()), path && (str += "; path=" + path), domain && (str += "; domain=" + domain), secure && (str += "; secure"), document.cookie = str, !0
}, EnvyWidget.prototype.getStorage = function(name) { return this.isLocalStorageNameSupported() ? localStorage.getItem(name) : this.getCookie(name) }, EnvyWidget.prototype.isLocalStorageNameSupported = function() { var test = "test_localstorage"; try { return window.localStorage.setItem(test, 1), window.localStorage.removeItem(test), !0 } catch (error) { return !1 } }, EnvyWidget.prototype.objectToUrl = function(object) { var str = ""; for (var key in object) object.hasOwnProperty(key) && object[key] && ("" != str && (str += "&"), str += key + "=" + encodeURIComponent(object[key])); return str }, EnvyWidget.prototype.removeOldValuesFromLocalStorage = function() { var regex = new RegExp("^" + this.localStoragePrefix, "i"); for (var key in localStorage) regex.exec(key) && this.getLocalStorageItem(key.replace(this.localStoragePrefix, "")) }, EnvyWidget.prototype.getLocalStorageItem = function(name) { var data = JSON.parse(localStorage.getItem(this.localStoragePrefix + name)); return data ? data.expiration < (new Date).getTime() ? (localStorage.removeItem(this.localStoragePrefix + name), null) : data.value : null }, EnvyWidget.prototype.setLocalStorageItem = function(name, value, expiration) {
    var date = (new Date).getTime() + 60 * expiration * 1e3,
        data = { value: value, expiration: date };
    localStorage.setItem(this.localStoragePrefix + name, JSON.stringify(data))
};
var ew = new EnvyWidget;
"loading" !== document.readyState ? ew.init() : document.addEventListener("DOMContentLoaded", function() { ew.init() });
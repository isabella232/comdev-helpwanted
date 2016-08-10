Number.prototype.pretty = (fix) ->
    if (fix)
        return String(this.toFixed(fix)).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return String(this.toFixed(0)).replace(/(\d)(?=(\d{3})+$)/g, '$1,');


fetch = (url, xstate, callback, snap) ->
    xmlHttp = null;
    # Set up request object
    if window.XMLHttpRequest
        xmlHttp = new XMLHttpRequest();
    else
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    #xmlHttp.withCredentials = true
    # GET URL
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    
    xmlHttp.onreadystatechange = (state) ->
            if xmlHttp.readyState == 4 and xmlHttp.status == 500
                if snap
                    snap(xstate)
            if xmlHttp.readyState == 4 and xmlHttp.status == 200
                if callback
                    # Try to parse as JSON and deal with cache objects, fall back to old style parse-and-pass
                    try
                        response = JSON.parse(xmlHttp.responseText)
                        callback(response, xstate);
                    catch e
                        callback(JSON.parse(xmlHttp.responseText), xstate)

post = (url, args, xstate, callback, snap) ->
    xmlHttp = null;
    # Set up request object
    if window.XMLHttpRequest
        xmlHttp = new XMLHttpRequest();
    else
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.withCredentials = true
    # Construct form data
    ar = []
    for k,v of args
        if v and v != ""
            ar.push(k + "=" + escape(v))
    fdata = ar.join("&")
    
    
    # POST URL
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(fdata);
    
    xmlHttp.onreadystatechange = (state) ->
            if xmlHttp.readyState == 4 and xmlHttp.status == 500
                if snap
                    snap(xstate)
            if xmlHttp.readyState == 4 and xmlHttp.status == 200
                if callback
                    # Try to parse as JSON and deal with cache objects, fall back to old style parse-and-pass
                    try
                        response = JSON.parse(xmlHttp.responseText)
                        callback(response, xstate);
                    catch e
                        callback(JSON.parse(xmlHttp.responseText), xstate)


postJSON = (url, json, xstate, callback, snap) ->
    xmlHttp = null;
    # Set up request object
    if window.XMLHttpRequest
        xmlHttp = new XMLHttpRequest();
    else
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.withCredentials = true
    # Construct form data
    fdata = JSON.stringify(json)
    
    # POST URL
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(fdata);
    
    xmlHttp.onreadystatechange = (state) ->
            if xmlHttp.readyState == 4 and xmlHttp.status == 500
                if snap
                    snap(xstate)
            if xmlHttp.readyState == 4 and xmlHttp.status == 200
                if callback
                    # Try to parse as JSON and deal with cache objects, fall back to old style parse-and-pass
                    try
                        response = JSON.parse(xmlHttp.responseText)
                        callback(response, xstate);
                    catch e
                        callback(JSON.parse(xmlHttp.responseText), xstate)


mk = (t, s, tt) ->
    r = document.createElement(t)
    if s
        for k, v of s
            if v
                r.setAttribute(k, v)
    if tt
        if typeof tt == "string"
            app(r, txt(tt))
        else
            if isArray tt
                for k in tt
                    if typeof k == "string"
                        app(r, txt(k))
                    else
                        app(r, k)
            else
                app(r, tt)
    return r

app = (a,b) ->
    if isArray b
        for item in b
            if typeof item == "string"
                item = txt(item)
            a.appendChild(item)
    else
        if typeof b == "string"
            item = txt(b)
            a.appendChild(item)
        else
            a.appendChild(b)


set = (a, b, c) ->
    return a.setAttribute(b,c)

txt = (a) ->
    return document.createTextNode(a)

get = (a) ->
    return document.getElementById(a)

swi = (obj) ->
    switchery = new Switchery(obj, {
                color: '#26B99A'
            })

cog = (div, size = 200) ->
        idiv = document.createElement('div')
        idiv.setAttribute("class", "icon")
        idiv.setAttribute("style", "text-align: center; vertical-align: middle; height: 500px;")
        i = document.createElement('i')
        i.setAttribute("class", "fa fa-spin fa-cog")
        i.setAttribute("style", "font-size: " + size + "pt !important; color: #AAB;")
        idiv.appendChild(i)
        idiv.appendChild(document.createElement('br'))
        idiv.appendChild(document.createTextNode('Loading, hang on tight..!'))
        div.innerHTML = ""
        div.appendChild(idiv)

isArray = ( value ) ->
    value and
        typeof value is 'object' and
        value instanceof Array and
        typeof value.length is 'number' and
        typeof value.splice is 'function' and
        not ( value.propertyIsEnumerable 'length' )
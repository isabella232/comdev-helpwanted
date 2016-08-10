###
 Licensed to the Apache Software Foundation (ASF) under one or more
 contributor license agreements.  See the NOTICE file distributed with
 this work for additional information regarding copyright ownership.
 The ASF licenses this file to You under the Apache License, Version 2.0
 (the "License"); you may not use this file except in compliance with
 the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
###

hw_weburl = new RegExp(
  "(" +
    # protocol identifier
    "(?:(?:https?|ftp)://)" +
    # user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      # IP address exclusion
      # private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      # IP address dotted notation octets
      # excludes loopback network 0.0.0.0
      # excludes reserved space >= 224.0.0.0
      # excludes network & broacast addresses
      # (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      # host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      # domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      # TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      # TLD may end with dot
      "\\.?" +
    ")" +
    # port number
    "(?::\\d{2,5})?" +
    # resource path
    "(?:[/?#]([^,<>()\\[\\] \\t\\r\\n]|(<[^:\\s]*?>|\\([^:\\s]*?\\)|\\[[^:\\s]*?\\]))*)?" +
    ")\\.?"
  , "mig"
);


pastels = genColors(16, 0.9, 0.85)
brights = genColors(16, 0.8, 0.675)

splashOptions = {
    'I want to help out!': 'this.parentNode.style.display="none"; wizard(1);',
    'I am an Apache committer and wish to add or edit tasks.': 'location.href="/admin/";',
    'I want to help spread the word about "Help Wanted"!': 'location.href="wtest.html";',
}


# Difficulty levels
diff = ['Beginner', 'Journeyman', 'Intermediate', 'Advanced', 'Expert']
diff_explanation = [
    'This is an easy task that anyone can get started on',
    'This requires a bit of knowledge of the project, but otherwise is an easy task',
    'This requires a good knowledge of the project',
    'This requires a good knowledge of the project and good technical skills',
    'This requires intimate knowledge of the project and excellent technical skills'
]

# Languages (programming + spoken)
langs = ['c', 'xml', 'c++', 'c-sharp', 'java', 'javascript', 'css', 'html', 'perl', 'ruby', 'lua', 'python', 'go', 'rust', 'erlang', 'swift', 'groovy', 'haskell', 'scala', 'php', 'bash', 'tcl', 'jsp', 'svg']
spoken_langs = ['english', 'french', 'german', 'spanish', 'russian', 'italian', 'japanese', 'chinese']
website_langs = ['css','javascript','html']

# Task categories
types = {
    programming: "Programming and Development"
    'web design': "Web Design"
    marketing: 'Marketing and Publicity'
    documentation: 'Documentation and Guides'
    community: 'Community Outreach'
    translation: 'Translation'
}


# TBD
projects = ['all projects']
cjson = {}

# Default item limit
max_items = 10

# Sort some things
langs.sort()

showSplash = (args) ->
    obj = get('splash')
    get('pickerparent').style.display = "none"
    get('wizard_step1').style.display = "none"
    obj.style.display = "block"
    obj.innerHTML = ""
    app(obj, mk('span', { style: "font-size: 20pt; font-family: sans-serif; color: #FFF;"}, "What would you like to do today?"))
    i = 0
    for title, oc of splashOptions
        p = pastels[i]
        b = brights[i]
        d = mk('div', { class: "option", onclick: oc, style: "background: rgba(" + p.r + "," + p.g + "," + p.b + ", 0.85);"})
        btn = mk('div', {style: "background: rgba(" + b.r + "," + b.g + "," + b.b + ", 1);"})
        app(d, btn)
        app(d, title)
        app(obj, d)
        i++

wstate = {}

wizard = (step, arg) ->
    obj = get('innerpicker')
    pobj = get('pickerparent')
    sobj = get('splash')
    wobj = get('wizard_step1')
    if step == 0
        pobj.style.display = "none"
        wobj.style.display = "none"
        sobj.style.display = "block"
    else if step > 1
        pobj.style.display = "block"
        
    get('hwitems').innerHTML = ""
    if not step or step == 0
        step = 1
    
    if step == 1
        wstate = {}
        wobj.style.display = "block"
        wcobj = get('wizard_step1_contents')
        wcobj.innerHTML = ""
        app(wcobj, mk('span', {style:'font-size: 20pt; font-family: sans-serif; color: #FFF;'}, "What kind of tasks would you like to help with?"))
        i = 0
        for type, desc of types
            p = pastels[i]
            b = brights[i]
            d = mk('div', {class: "option", onclick:"wizard(2, '" + type + "');", style: "background: rgba(" + p.r + "," + p.g + "," + p.b + ", 0.85);"})
            btn = mk('img', { src: "images/" + type.replace(/\s+/g, "") + "_large.png", style: "width: 36px; heigh: 36px; vertical-align: middle; padding: 4px; padding-right: 12px;"})
            app(d, btn)
            app(d, desc)
            app(wcobj, d)
            i++;
        
        
        # show me everything
        p = pastels[i]
        b = brights[i]
        d = mk('div', {class: "option", onclick: "fetchItems();", style: "background:rgba(" + p.r + "," + p.g + "," + p.b + ", 0.85);"})
        btn = mk('img', {src: "images/everything_large.png", style: "width: 36px; heigh: 36px; vertical-align: middle; padding: 4px; padding-right: 12px;"})
        app(d, btn)
        app(d, "Just show me everything...")
        app(wcobj, d)
        
    if step == 2 and arg
        wstate = {
            type: arg
        }
        desc = types[arg]
        wcobj = get('wizard_step1_contents')
        wcobj.innerHTML = ""
        app(wcobj, mk('span', {style:'font-size: 20pt; font-family: sans-serif; color: #FFF;'}, desc))
        obj = mk('div', {class: "optiontwo"})
        app(wcobj, obj)
        i = 0
        for type, desc of types
            if type == arg
                break
            i++;
        
        p = pastels[i]
        b = brights[i]
        obj.style.background = "rgba(" + p.r + "," + p.g + "," + p.b + ", 0.95)"
        obj.style.color = "#333 !important"
        obj.style.height = "340px"
        
        app(obj, mk('h2', {style: "margin-bottom: 4px; line-height: 18pt; text-align: center;"}, "Which languages are you proficient in?"))
        app(obj, mk('p', {}, "You don't need to pick a language, but it will help narrow down the tasks available for you."))
        
        if arg in ['programming', 'documentation']
            for lang, i in langs
                div = mk('div', { style: "float: left; width: 100px; height: 28px;"})
                cb = mk('input', { type: "checkbox", id:  "plang_" + lang })
                lbl = mk('label', {for: "plang_" + lang}, lang)
                app(div, cb)
                app(div, lbl)
                app(obj, div)
            app(obj, mk('br'))
        else if arg == 'web design'
            for lang, i in website_langs
                div = mk('div', { style: "float: left; width: 100px; height: 28px;"})
                cb = mk('input', { type: "checkbox", id:  "plang_" + lang })
                lbl = mk('label', {for: "plang_" + lang}, lang)
                app(div, cb)
                app(div, lbl)
                app(obj, div)
            app(obj, mk('br'))
        else
            for lang, i in spoken_langs
                div = mk('div', { style: "float: left; width: 100px; height: 28px;"})
                cb = mk('input', { type: "checkbox", id:  "plang_" + lang })
                lbl = mk('label', {for: "plang_" + lang}, lang.replace(/^([a-z])/, (a) => a.toUpperCase() ))
                app(div, cb)
                app(div, lbl)
                app(obj, div)
            app(obj, mk('br'))

        fdiv = mk('div', { style: "height: 60px; width: 100%; margin-top: 30px; float: left;"})
        fbtn = mk('input', { type: "button", class: "finishbutton", onclick: "doForm(this.parentNode.parentNode);", value: "Find me something to do!"})
        fspan = mk('span', { style: "font-size: 14pt; color: #333;"}, "◀")
        app(fspan, mk('a', {style:"color: #333;", onclick:"wizard(1)", href:"javascript:void(0);"}, "Back to start"))
        app(fdiv, [fbtn, fspan])
        app(obj, fdiv)

populateForm = () ->
    # languages
    f = get('plang')
    for lang in langs
        div = mk('div', { style: "float: left; width: 100px;" })
        cb = mk('input', { type: "checkbox", id: "plang_" + lang})
        lbl = mk('label', { for: "plang_" + lang}, lang)
        app(div, [cb, lbl])
        app(f, div)
    app(f, mk('br'))
    
    # task types
    f = get('ptypes')
    for type in types
        div = mk('div', { style: "float: left; width: 200px;" })
        cb = mk('input', { type: "checkbox", id: "ptype__" + type})
        lbl = mk('label', { for: "ptype_" + type}, type)
        app(div, [cb, lbl])
        app(f, div)
    app(f, mk('br'))
    
    
    # projects - none for now
    f = get('pprojects')
    app(f, "All projects")


doForm = (par) ->
    l = []
    t = []
    p = []
    for lang in langs
        if get("plang_" + lang) and get("plang_" + lang).checked
            l.push(lang)
    for type in types
        if get("ptype_" + type) and get("ptype" + type).checked
            t.push(type)
    if wstate.type
        t = [wstate.type]
    
    if wstate.projects
        p = wstate.projects
    fetchItems(l, t, p, null, par)

sw = (id) ->
    obj = get(id)
    obj.style.display = (if obj.style.display == 'none' then 'table-row' else 'none')


reallyPopulate = (json, state) ->
    pro = []
    obj = get('project')
    
    # optgroup for spoken/written
    optg = mk('optgroup', { label: (if state then 'Non-TLPs:' else 'Top Level Projects:')})
    app(obj, optg)
    
    for group in (json.committees || json.groups)
        pro.push(group)
        app(obj, mk('option', { value: group}, group ))
    if state
        return
    
    obj = get('languages')
    # optgroup for programming
    optg = mk('optgroup', { label: "Programming languages:"})
    app(obj, optg)
    
    # prog languages
    for lang in langs
        app(obj, mk('option', { text: lang, value: lang}, lang ))
    
    # optgroup for spoken/written
    optg = mk('optgroup', { label: "Spoken languages:"})
    app(obj, optg)
    
    for lang in spoken_langs
        app(obj, mk('option', {value: lang}, lang.replace(/^([a-z])/, (a) => a.toUpperCase()) ))
        opt = document.createElement('option')
    if not state or state == 0
        fetch('https://whimsy.apache.org/public/public_nonldap_groups.json', 'other', reallyPopulate)

populateAdminForm = () ->
    fetch('https://whimsy.apache.org/public/public_ldap_committees.json', false, reallyPopulate)   


displayItems = (json, state) ->
    json = if json then json.tasks else cjson
    cjson = json
    numItems = 0
    for item in json
        if item.closed
            continue
        numItems++
    
    if numItems == 0 and state and state.parentObject
        state.parentObject.style.display = 'none'
        window.setTimeout(
          () ->
            state.parentObject.style.display = 'block'
          , 50)
        state.parentObject.innerHTML =""
        div = mk('div', { style: "line-height: 12pt; text-align: center;"}, [
          mk('h2', {}, "Dang it!"),
          mk('p', {}, [
            "Sorry, we couldn't find any open tasks matching your criteria.",
            mk('br'),
            "You could try expanding your search or picking a different category.",
            mk('br'),
            mk('br')
            ]),
          mk('p', {}, [
            mk('span', { style:"font-size: 14pt; color: #333;"}, [
              "◀",
              mk('a', { style:"color: #333;", onclick:'wizard(1)', href:'javascript:void(0);'}, "Back to start")
              ])
            ])
          ])
          
        app(state.parentObject, div)
        return
    
    if state and typeof(state) == "string"
        if (hw_oldstate == state)
            json.sort((a,b) => a[state] < b[state])
            hw_oldstate = ""
        else
            json.sort((a,b) => a[state] > b[state])
            hw_oldstate = state
    
    obj = get('hwitems')
    
    if (typeof(numItems) == 'undefined')
        obj.innerHTML = "Sorry, we couldn't find any tasks matching your criteria"
        return
    
    
    obj.innerHTML = "<p id='hwrtable'>Found " + numItems + " item" + (if numItems != 1 then "s" else "") + " you might be interested in:</p>"
    colors = genColors(numItems+2)
    
    admintab = ""
    if state and state.admin
        admintab = "<th style='width: 80px;'>Actions</th>"
    
    tbl = "<table style='text-align: left; width: 100%;'>" +
    "<tr style='cursor: pointer' title='Click on a column to sort'><th>&nbsp;</th><th onclick='displayItems(null, \"project\");'>Project</th>" +
    "<th onclick='displayItems(null, \"title\");'>Title</th>" +
    "<th onclick='displayItems(null, \"languages\");'>Languages</th>" +
    "<th onclick='displayItems(null, \"difficulty\");'>Difficulty</th>" +
    "<th onclick='displayItems(null, \"created\");'>Created</th>" +
    admintab + "</tr>"
    for item, i in json
        if item.closed
            continue
        
        if i >= max_items
            tbl += "<tr><td colspan='5'><a href='javascript:void(0);' onclick='max_items += 10; displayItems(null, " + JSON.stringify(state||{}) + ");'>Show more tasks</a></td></tr>"
            break
        
        z = i+1
        ptype = item.type.replace(/\s+/g, "")
        cdate = new Date(item.created*1000).toLocaleString()
        lingos = (if item.languages != 'n/a' then item.languages.split(",").join(", ") else "")
        
        # admin stuff
        add = ""
        if state and state.admin
            add = " <td><a href='/admin/close.lua?id=" + item.request_id + "'>Mark as done</a></td>"
        
        item.description = item.description.replace(/\n/g, "<br/>").replace(hw_weburl, (a) => ("<a href='"+a+"'>"+a+"</a>"))
        tbl += "<tr style='cursor: pointer;' onclick=\"sw('details_" + i + "');\"><td width='68'><div class='itemNumber-yellow'>" + z + "</div><img title='" + item.type + "' style='float: left; width: 24px; height: 24px;' src='https://helpwanted.apache.org/images/icon_" + ptype + ".png'/></td>" +
        "<td>" + item.project + "</td>"+
        "<td style='text-align: left;'>" + item.title + "</td>" +
        "<td>" + lingos + "</td><td title='" + diff_explanation[parseInt(item.difficulty)] + "' style='text-align: left;'><img style='width: 20px; height: 20px; vertical-align: middle;' src='https://helpwanted.apache.org/images/level_" + (parseInt(item.difficulty)+1) + ".png'/> " + diff[item.difficulty] + "</td><td>" + cdate + "</td>" + add + "</tr>"
        
        tbl += "<tr style='display:none;' id='details_" + i + "'><td colspan='6'><b>Project:</b> " + item.project + "<br/><b>Requested by:</b> " + item.author + "@apache.org<br/><b>Created:</b> " + cdate + "<br/><b>Description:</b> <blockquote>" + item.description + "</blockquote><b>Further information: </b> <a href='" + item.url + "'>" + item.url + "</a><br/><input type='button' onclick='location.href=\"https://helpwanted.apache.org/task.html?" + item.request_id + "\";' value='I am interested in this'/></td></tr>"
     
    tbl += "</table>"
    obj.innerHTML += tbl
    if location.href.search('admin') == -1
        location.hash = '#hwrtable'
    
    
fetchItems = (languages, types, projects, sortBy, par) ->
    if not languages
      languages = []
    if not types
      types = []
    if not projects
      projects = []
    fetch("https://helpwanted.apache.org/tasks.lua?lang=" + languages.join(",") + "&type=" + types.join(",") + "&project=" + projects.join(","),
                 {
                    languages: languages,
                    types: types,
                    projects: projects,
                    sortBy: sortBy,
                    parentObject: par
                    }, displayItems)


fetchItemsAdmin = () ->
    fetch("https://helpwanted.apache.org/tasks.lua", {admin: true}, displayItems)


renderItem = (json, state) ->
    p = pastels[parseInt(Math.random()*pastels.length)]
    obj = get('item')
    cdate = new Date(json.created*1000).toDateString()
    rid = json.request_id.substring(0,8)
    overrides = {
        comdev: 'community',
        whimsy: 'whimsical'
    }
    if (overrides[json.project])
        json.project = overrides[json.project]
    
    json.description = json.description.replace(/\n/g, "<br/>").replace(hw_weburl, (a) => ("<a href='"+a+"'>"+a+"</a>"))
    obj.innerHTML = "<h2>Task #" + state.substring(0,8) + ": " + json.title + "</h2>"
    mlink = "mailto:dev@" + json.project + ".apache.org?subject=" + escape("Help with task: " + json.title) + "&body=" + escape("I would like to help out with the task listed at https://helpwanted.apache.org/task.html?" + rid + "\n\n")
    rgba = "rgba(" + p.r + "," + p.g + "," + p.b + ", 1)"
    obj.innerHTML += "<div id='pickerparent' style='background: " + rgba + "; padding:12px;'><p style='text-align: left;'><b>Project: </b> " + json.project + "<br/>" +
        "<b>Created by:</b> " + json.author + "@apache.org<br/>" +
        "<b>Task added: </b>" + cdate + "<br/>" +
        "<b>Difficulty: </b> <img style='width: 16px; height: 16px; vertical-align: middle;' src='/images/level_" + (parseInt(json.difficulty)+1) + ".png'/> " + diff[json.difficulty] + " - " + diff_explanation[parseInt(json.difficulty)] + "<br/>" +
        "<b>Task type:</b> " + types[json.type] + "<br/>" +
        (if json.url and json.url.length > 10 then ("<b>Additional information:</b> <a href='" + json.url + "'>" + json.url + "</a><br/>") else "")+
        (if json.estimate and json.estimate.length > 0 then ("<b>Estimated time to complete:</b> " + json.estimate) else "") +
        (if json.timeout and json.timeout > 0 then ("<b>Task expires:</b> " + new Date(json.timeout*1000).toDateString()) else "") +
        "<blockquote style='text-align: left;'><q>" + json.description + "</q></blockquote>" +
        "<br/></p>" +
        "<h3 style='text-align: left;'>How to help:</h3><p style='text-align: left;'>" +
        (if json.curl and json.curl.length > 10 then ("<b>Contributor's guide for this project: </b><a href='" + json.curl + "'>" + json.curl + "</a><br/>") else "") +
        "If you want to help with this task, please get in touch with the project at: <a href=\""+mlink+"\">dev@" + json.project + ".apache.org</a>!" +
        "<br/>You should also check out the additional information URL (if such is provided above) for more information."
        "<br/>&nbsp;<br/>&nbsp;<br/></p></div>"

displayItem = (id) ->
    fetch("https://helpwanted.apache.org/tasks.lua?id=" + id, id, renderItem)

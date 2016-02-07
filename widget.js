/*
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
*/
var widgetobj = null
var widgetproject = "???"
var widgettitle = null
var hw_json = null
var maxitems = 8

var diff_explanation = [
    'This is an easy task that anyone can get started on',
    'This requires a bit of knowledge of the project, but otherwise is an easy task',
    'This requires a good knowledge of the project',
    'This requires a good knowledge of the project and good technical skills',
    'This requires intimate knowledge of the project and excellent technical skills'
]

function getAsyncJSON(theUrl, xstate, callback) {
	var xmlHttp = null;
	if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlHttp.open("GET", theUrl, true);
	xmlHttp.send(null);
	xmlHttp.onreadystatechange = function(state) {

		if (xmlHttp.readyState == 4 && xmlHttp.status == 200 || xmlHttp.status == 404) {
			if (callback) {
				if (xmlHttp.status == 404) {
					callback({}, xstate);
				} else {
					window.setTimeout(callback, 0.05, JSON.parse(xmlHttp.responseText), xstate);
				}
			}
		}
	}
}

var hw_oldstate = ""
function displayItemsWidget(json, state) {
    hw_json = json ? json : hw_json
    json = hw_json
    var diff = ['Beginner', 'Journeyman', 'Intermediate', 'Advanced', 'Expert']
    var numItems = 0
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        numItems++
    }
    var obj = widgetobj
    obj.setAttribute("class", "hwitems hwwidget")
    
    if (state && typeof(state) === "string") {
        if (hw_oldstate == state) {
            json.sort(function(a,b) { return a[state] < b[state] })
            hw_oldstate = ""
        } else {
            json.sort(function(a,b) { return a[state] > b[state] })
            hw_oldstate = state
        }
        
    }
    
    obj.innerHTML = ""
    var tbl = "<table style='width: 100%; text-align: left;'><tr><td colspan='5' style='text-align: center;'><img src='https://helpwanted.apache.org/images/cube.png'/> Tasks " + widgettitle + " would like help with:</td></tr>" +
    "<tr style='cursor: pointer' title='Click on a column to sort'><th onclick='displayItemsWidget(null, \"title\");'>Title</th>" +
    "<th onclick='displayItemsWidget(null, \"languages\");'>Languages</th>" +
    "<th onclick='displayItemsWidget(null, \"difficulty\");'>Difficulty</th>" +
    "<th onclick='displayItemsWidget(null, \"created\");'>Created</th></tr>"
    
    if (typeof(numItems) === 'undefined' || numItems == 0) {
        obj.innerHTML = tbl + "<tr><td colspan='5'>Sorry, we couldn't find any tasks matching your criteria</td></tr>" +
        "<tr><td colspan='4' style='text-align: center;'>Powered by <a href='https://helpwanted.apache.org/'>Help Wanted</a> - a task directory for Apache projects</td></tr>" +
        "</table>"
        return
    }
    
    
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        if (parseInt(i) >= maxitems) {
            tbl += "<tr><td colspan='5'><a href='javascript:void(0);' onclick='maxitems += 8; displayItemsWidget(null, {});'>Show more tasks</a></td></tr>"
            break
        }
        var z = parseInt(i)+1
        var ptype = item.type.replace(/\s+/g, "")
        var cdate = new Date(item.created*1000).toLocaleString()
        var lingos = (item.languages != 'n/a') ? item.languages : ""
        
        // admin stuff
        var add = ""
        if (state.admin) {
            add = " &nbsp; <a href='/admin/close.lua?id=" + item.request_id + "'>Mark as done</a>"
        }
        
        tbl += "<tr style='cursor: pointer; ' onclick=\"sw('hw_details_" + i + "');\"><td style='text-align: left;'><div class='itemNumber-widget'>" + z + "</div><img title='" + item.type + "' style='width:16px; height: 16px;' float: left;' src='https://helpwanted.apache.org/images/icon_" + ptype + ".png'/>" +
        item.title + "</td>" +
        "<td>" + lingos + "</td><td style='text-align: left;' title='" + diff_explanation[parseInt(item.difficulty)] + "'><img style='width:16px; height: 16px;' src='https://helpwanted.apache.org/images/level_" + (parseInt(item.difficulty)+1) + ".png'/> " + diff[item.difficulty] + add + "</td><td>" + cdate + "</td></tr>"
        var fi = ""
        if (item.url && item.url.length > 10) {
            fi = "<b>Further information: </b> <a href='" + item.url + "'>" + item.url + "</a><br/>"
        }
        
        tbl += "<tr style='display:none;' id='hw_details_" + i + "'><td colspan='6'><b>Project:</b> " + item.project + "<br/><b>Requested by:</b> " + item.author + "@apache.org<br/><b>Created:</b> " + cdate + "<br/><b>Description:</b> <blockquote>" + item.description + "</blockquote>" + fi + "<input type='button' class='dibbutton' onclick='location.href=\"https://helpwanted.apache.org/task.html?" + item.request_id + "\";' value='I am interested in this'/></td></tr>"
        
    }
    tbl += "<tr><td colspan='4' style='text-align: center;'>Powered by <a href='https://helpwanted.apache.org/'>Help Wanted</a> - a task directory for Apache projects</td></tr></table>"
    obj.innerHTML += tbl
}

function fetchItemsWidget(languages, types, projects, sortBy) {
    if (!languages) languages = []
    if (!types) types = []
    if (!projects) projects = []
    getAsyncJSON("https://helpwanted.apache.org/listitems.lua?lang=" + languages.join(",") + "&type=" + types.join(",") +"&project=" + projects.join(","),
                 {
                    languages: languages,
                    types: types,
                    projects: projects,
                    sortBy: sortBy
                    }, displayItemsWidget)
}

function sw(id) {
    var obj = document.getElementById(id)
    var op = obj.style.display == 'none' ? 'table-row' : 'none'
    obj.style.display = op
}

var divs = document.getElementsByTagName('div')
for (var i in divs) {
    var dt = divs[i].getAttribute("type")
    var dn = divs[i].getAttribute("project")
    var dti = divs[i].getAttribute("description")
    if (dt && dt == "helpwanted" && dn) {
        widgetobj = divs[i]
        widgetproject = dn
        widgettitle = dti ? dti : dn
        var css = document.createElement('link')
        css.rel = "stylesheet";
        css.href = "https://helpwanted.apache.org/css/hw2.css";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(css)
        fetchItemsWidget([],[],[dn])
        break
    }
}
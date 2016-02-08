--[[
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

]]--

local JSON = require 'cjson'
local elastic = require 'elastic'

function handle(r)
    r.content_type = "text/html"
    local t = {}
    local now = r:clock()
    local tnow = now
    local get = r:parseargs()
    local post, postm = r:parsebody()
    
    local project = r:escape_html(post.project or "")
    local typ = r:escape_html(post.type)
    local title = r:escape_html(post.title)
    local lingos = r:escape_html(table.concat(postm.languages or {'n/a'}, ","))
    local difficulty = tonumber(post.difficulty) or 0
    local desc = r:escape_html(post.description)
    local url = r:escape_html(post.url or "")
    local curl = r:escape_html(post.curl or "")
    local collab = (post.collaboration and post.collaboration == 'yes') and true or false
    
    
    if project and #project > 2 and typ and title and lingos and difficulty and desc then
        elastic.index(r, nil, 'item', JSON.encode{
            project = project,
            ['type'] = typ,
            languages = lingos,
            title = title,
            difficulty = difficulty,
            description = desc,
            url = url,
            curl = curl,
            collaboration = collab,
            created = os.time(),
            author = r.user or "unknown",
            estimate = 0,
            timeout = 0,
        }
            )
        r:puts("Task saved!")
    else
        r:puts("Something was missing, go back!")
    end
    return apache2.OK
end

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
    local id = get.id
    local doc = elastic.get('item', id)
    if doc then
        if get.reopen then
            elastic.update('item', id, { closed = false })
            r:puts("Task reopened!")
        else
            elastic.update('item', id, { closed = true })
            r:puts("Task closed!")
        end
    else
        r:puts("No such task :(")
    end
    return apache2.OK
end
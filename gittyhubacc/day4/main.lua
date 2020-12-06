#!/usr/bin/lua

local Passport = require 'passport'

local passport
local data = {}
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do
	if #line == 0 then passport = nil else
		if not passport then
			passport = Passport()
			data[#data + 1] = passport
		end
		passport:parse(line)
	end
end
f:close()

local part1 = 0
local part2 = 0
for i, p in ipairs(data) do
	if p:present() then
		part1 = part1 + 1
		if p:valid() then
			part2 = part2 + 1
		end
	end
end

print('part1: ', part1)
print('part2: ', part2)

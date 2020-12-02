#!/usr/bin/lua

function parse_pattern(input)
	local p = {}
	p.target = string.match(input, '%a')
	p.low = tonumber(string.match(input, '%d+'))
	p.high = tonumber(string.match(input, '-(%d+)'))
	return p
end

local data = {}
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do
	data[#data + 1] = {
		pat = parse_pattern(string.match(line, '(.+):')),
		passwd = string.match(line, ': (%a+)')
	}
end
f:close()

local part1 = 0
for i, v in ipairs(data) do
	local _, count = string.gsub(v.passwd, v.pat.target, '!')
	if count >= v.pat.low and count <= v.pat.high then
		part1 = part1 + 1
	end
end

local part2 = 0
for i, v in ipairs(data) do
	local found = 0
	local target = string.byte(v.pat.target)
	if string.byte(v.passwd, v.pat.low) == target then
		found = found + 1
	end
	if string.byte(v.passwd, v.pat.high) == target then
		found = found + 1
	end
	if found == 1 then part2 = part2 + 1 end
end

print('part 1: ' .. part1)
print('part 2: ' .. part2)

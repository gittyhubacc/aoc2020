#!/usr/bin/lua

local group = 0
local found = nil
local part = { one = 0, two = 0 }
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do
	if #line <= 0 then 
		for _, list in pairs(found) do
			if #list == group then
				part.two = part.two + 1
			end
		end
		found = nil
		group = 0
	else
		if not found then found = {} end
		group = group + 1
		for c in string.gmatch(line, '%a') do
			if not found[c] then 
				part.one = part.one + 1
				found[c] = {} 
			end
			found[c][#found[c] + 1] = c
		end
	end
end
f:close()

print('part1: ', part.one)
print('part2: ', part.two)

#!/usr/bin/lua

local target = string.byte('#')

function find_trees(m, slope)
	local count = 0
	local height = #m
	local width = #m[1]
	local cursor = { x = 1, y = 1 }
	while cursor.y < height do
		cursor.y = cursor.y + slope.y
		cursor.x = cursor.x + slope.x
		if cursor.x > width then
			cursor.x = cursor.x - width
		end

		local index = cursor.x
		local line = m[cursor.y]
		local hit = string.byte(line, index)
		if hit == target then
			count = count + 1
		end
	end
	return count
end

local data = {}
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do
	data[#data + 1] = line
end
f:close()


local w = find_trees(data, { x = 1, y = 1 })
local part1 = find_trees(data, { x = 3, y = 1 })
local x = find_trees(data, { x = 5, y = 1 })
local y = find_trees(data, { x = 7, y = 1 })
local z = find_trees(data, { x = 1, y = 2 })

print('part1: ', part1)
print('part2: ', w * part1 * x * y * z)

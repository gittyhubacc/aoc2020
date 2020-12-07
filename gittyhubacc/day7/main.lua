#!/usr/bin/lua

function part1_fn(bags, color, mem)
	if not bags[color] then return 0 end

	local cost = 0
	for _, bag in ipairs(bags[color]) do
		if not mem[bag.color] then 
			mem[bag.color] = true
			cost = cost + 1
		end
		cost = cost + part1_fn(bags, bag.color, mem)
	end
	return cost
end

function part2_fn(map, color, mem)
	if mem[color] then return mem[color] end

	local _cost = 1
	local bag = map[color]
	for c, q in pairs(bag.rules) do
		if not mem[c] then 
			mem[c] = part2_fn(map, c, mem) 
		end
		_cost = _cost + (q * mem[c])
	end
	return _cost
end

local color, c, q
local bagmap = {}	-- color => bag (children colors)
local reverse = {}	-- child color => parent bag
local f = io.open(arg[1] or 'input.txt')
for l in f:lines() do
	color = string.match(l, '([%a%s]+) bags ')
	bagmap[color] = { color = color, rules = {} }
	for rule in string.gmatch(l, '(%d+ [%w%s]+)[.,]') do
		q, c = string.match(rule, '(%d+) (%a[%a%s]+) bag')
		bagmap[color].rules[c] = q
		if not reverse[c] then reverse[c] = {} end
		reverse[c][#reverse[c] + 1] = bagmap[color]
	end
end
f:close()

print('part1: ' .. part1_fn(reverse, 'shiny gold', {}))
print('part2: ' .. part2_fn(bagmap, 'shiny gold', {}) - 1)

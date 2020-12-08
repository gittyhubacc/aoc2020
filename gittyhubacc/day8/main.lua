#!/usr/bin/lua

local Env = require 'env'

local env = Env()
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do env:parse(line) end
f:close()

local part1 = env:simple_eval()
env:reset()
local part2 = env:eval()

print('part 1: ' .. part1)
print('part 2: ' .. part2)

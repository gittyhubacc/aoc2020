#include <string.h>
#include <stdint.h>
#include <stdio.h>

const uint32_t primes[] = { 17, 37, 449, 23, 13, 19, 607, 41, 29 };
const uint32_t modulo[] = {  0, 11,  17, 25, 30, 36,  48, 58, 77 };

uint64_t running_product(const uint32_t *n, int len)
{
	uint64_t p = 1;
	for (int i = 0; i < len; i++) {
		p *= n[i];
	}
	return p;
}

const char *const df_filename = "input.txt";
int main(int argc, char **argv)
{
	uint64_t _step = 0;
	uint64_t part2 = 0;
	for (int i = 1; i < 9; i++) {
		_step = step(primes, i);
		while ((part2 + modulo[i]) % primes[i]) {
			part2 += _step;
		}
	}
	return 0;
}

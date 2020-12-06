//day 1 part 1 and day 1 part 2, but higher time complexity, is in the other file

#include <iostream>
#include <unordered_set>

int main(){
    int array[] = {/*input data array*/};
    std::unordered_set<int> set(std::begin(array), std::end(array));

    for(int i = 0; i < set.size(); i++){
        for(int j = 0; j < set.size(); j++){
            if(set.count(2020-array[i]-array[j])){
                std::cout << (2020-array[i]-array[j])*array[i]*array[j] << "\n";
                return 0;
            }
        }
    }
}

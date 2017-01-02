pragma solidity ^0.4.2;
import "SimpleContract.sol";
contract Scorer is SimpleContract("Scorer"){


int  [] public weights;
int public normalisation;

modifier indexIsValid (uint _index){if (_index < weights.length) _;}


function calculateScore(int _metric1,int _metric2,int _metric3) returns (int){
    int score = 0;
    score = _metric1 * weights[0] + _metric2 * weights[1] + _metric3 * weights[2];
    score = score / normalisation;

   return score;
}

function updateWeight(uint _index, int _weight) onlyOwner indexIsValid(_index) {
    weights[_index]=_weight;
}
function updateNormalisation(int _normalisation) onlyOwner {
   normalisation =  _normalisation;
}

}

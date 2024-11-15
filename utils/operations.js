
function convertStringToArray(value) {
    // If value is already an array, return it as is
    if (Array.isArray(value)) {
        return value;
    }
    // Otherwise, split the string by comma and trim each value
    return value.split(',').map(item => item.trim());
}

function convertNumberToSort(number) {
    if (number === 1){
      return 'ASC'
    } else {
      return 'DESC'
    }
  }


const Operations = {
    convertStringToArray,
    convertNumberToSort
};

module.exports = Operations;
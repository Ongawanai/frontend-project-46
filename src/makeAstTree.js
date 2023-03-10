import _ from 'lodash';

const makeAstTree = (file1, file2) => {
  const allKeys = _.sortBy(_.union(Object.keys(file1), Object.keys(file2)));

  const result = allKeys.map((key) => {
    const value1 = file1[key];
    const value2 = file2[key];
    if (!_.has(file2, key)) {
      return { status: 'deleted', name: key, value: value1 };
    }
    if (!_.has(file1, key)) {
      return { status: 'added', name: key, value: value2 };
    }
    if (value1 === value2) {
      return { status: 'unchanged', name: key, value: value1 };
    }
    if (_.isObject(value1) && _.isObject(value2)) {
      return { status: 'nested', name: key, value: makeAstTree(value1, value2) };
    }
    return {
      status: 'changed',
      name: key,
      oldValue: value1,
      newValue: value2,
    };
  });
  return result;
};

export default makeAstTree;

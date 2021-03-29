/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import buildQueryTests from './builders/buildQueryTest';
import buildModelTests from './builders/buildModelTest';

describe('Builders', function () {
    describe('#buildModel()', function () {
        buildModelTests();
    });
    describe('#buildQuery()', function () {
        buildQueryTests();
    });
});
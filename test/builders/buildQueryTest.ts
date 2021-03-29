/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { expect } from 'chai';
import { GraphQLList, GraphQLInt } from 'graphql';

import { Resolver, Query, Arg, Filter, buildQuery } from '../../src';


function run() {
    it('should not throw an error', function () {
        @Resolver('query')
        class NumberQuery {
            @Query(() => GraphQLList(GraphQLInt))
            numbers!: () => number[];

            @Query(() => GraphQLInt)
            @Arg(() => GraphQLInt, 'id', 'Az ID, amelyre szűrni szeretnénk.')
            @Filter({ argName: 'id', operator: 'EQUAL', columnName: 'id' })
            number!: () => number;
        }

        expect(() => {
            buildQuery(NumberQuery);
        }).not.to.throw('the builder should not throw an error');
    });
}

export default run;
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { expect } from 'chai';
import { GraphQLString, GraphQLInt } from 'graphql';

import { Field, Description, buildModel } from '../../src';


function run() {
    it('should not throw an error', function () {
        class AuthorModel {
            @Field(() => GraphQLString)
            @Description('A szerző neve.')
            name!: string;

            @Field(() => GraphQLInt)
            @Description('A szerző kora.')
            age!: number;
        }

        expect(() => {
            buildModel(AuthorModel);
        }).not.to.throw('the builder should not throw an error');
    });
}

export default run;
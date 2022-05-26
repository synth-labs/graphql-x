# graphql-x

The `graphql-x` is built to simplify the process of creating "code-first" GraphQL models, common mutations and generate fast queries by using an efficient GraphQL to SQL conversion.

The models, queries and mutations can be defined with Typescript classes using the decorators provided by `graphql-x`.

## Commands

Compiling the Typescript files:

```bash
npm run build
```

Linting the files:

```bash
npm run lint
```

## Config

A `.env` file is required, containing the following variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=db_user
DB_PASS=db_password
```

(The provided values are just examples.)

If the `QUERY_DEBUG` variable is set to `true` then the generated SQL queries are printed to the console when the resolver is called:

```env
QUERY_DEBUG=true
```

## Examples

### Models

```typescript
import { GraphQLList, GraphQLString, GraphQLInt } from "graphql";

import { Model, Field, Description, JoinBackward, Junction, buildModel } from "@synthesis-labs/graphql-x";
import { Author, _Author } from "./Author";
import { BookChapter, _BookChapter } from "./BookChapter";

@Model("products", "books")
class _Book {
    @Field(type => GraphQLInt)
    id!: number;

    @Field(type => GraphQLString)
    @Description("A könyv címe.")
    title!: string;

    @Field(type => GraphQLString, true)
    @Description("A  könyv alcíme ha van, ellenben `null`.")
    subtitle?: string;

    @Field(type => GraphQLList(Author))
    @Description("A könyv szerzői.")
    @Junction("book_authors", "book", "author")
    authors!: _Author[];

    @Field(type => GraphQLList(BookChapter))
    @Description("A könyvben található fejezetek.")
    @JoinBackward("book")
    chapters!: _BookChapter[];
}

const Book = buildModel(_Book);

export { Book, _Book };
```

The `@Field` decorator can be used to create a new field on the GraphQL type. It accepts a thunk which return the desired type. This thunk based approach is used extensively to lazy-load the types, avoiding circular dependencies, which is common is GraphQL.

The `@Description` decorator is used to specify a description for the field in the GraphQL schema.

The `@Junction`, `@JoinForward` and `@JoinBackward` decorators are used to set the underlying SQL joins.

Finally the `buildModel(...)` function creates the `GraphQLObjectType` from the class. Unfortunately, this is necessary due to the internal structure of `graphql-js`.

### Queries

```typescript
import { GraphQLList, GraphQLInt } from "graphql";

import { Resolver, Query, Arg, Filter, buildQuery } from "@synthesis-labs/graphql-x";
import { Book, _Book } from "../../Models/Books/Book";

@Resolver("query")
class BookQuery {
    @Query(type => GraphQLList(Book))
    books!: () => _Book[];

    @Query(type => Book)
    @Arg(type => GraphQLInt, "id", "Az ID, amelyre szűrni szeretnénk.")
    @Filter({ argName: "id", operator: "EQUAL", columnName: "id" })
    book!: () => _Book;
}

const queries = buildQuery(BookQuery);

export default queries;
```

This example shows two auto generate queries for the `Book` model. The first one, `books` return an array of all available books, while the `book` query returns a specific book, identified by its unique id.

These queries are generated automatically and use a GraphQL AST to SQL AST conversion to query only the necessary data from the database, in one SQL statement. This eliminates the n+1 problem.

First, the `@Resolver` decorator tells the type of the resolver. It can be `query` or `mutation` resolver.

The `@Query` decorator indicates that a query must be generated. It accepts the type as a thunk just as seen before.

The `@Arg` decorator is used to create arguments for the query. It requires a type (thunk), an argument name and an argument description. Optionally it accepts a final bool parameter to make the created argument optional, but it's `false` by default.
In this example the generated query is the following:

```graphql
book(id: Int!): Book
```

The `@Filter` decorator is used to tell the framework how the argument must be used. It specifies the relation between the value of the argument and the given SQL column. The `@Filter({ argName: "id", operator: "EQUAL", columnName: "id" })` example above means that in the SQL query, a WHERE statement is generated, roughly in the following form: `` WHERE `id` = args.id ``.

The `@Filter` decorator also accepts a modifier function. Modifiers are MySQL functions, applied to the given column.

E.g.: `@Filter({ argName: "year", operator: "EQUAL", columnName: "date", modifier: "DATE:YEAR" })` which means `` WHERE YEAR(`date`) = args.year ``

### Mutations

```typescript
import { GraphQLInt, GraphQLList } from "graphql";
import { PrismaClient } from "@prisma/client";

import { Resolver, Arg, Mutation, CreateJoined, buildMutation, Join, Unjoin } from "@synthesis-labs/graphql-x";

import { Book, _Book } from "../../../Models/Books/Book";
import { BookInputCreate } from "./BookInputCreate";
import { BookInputUpdate } from "./BookInputUpdate";

import QueryRoot from "../../../mutation_root";

const productsDB = new PrismaClient();

@Resolver("mutation")
class BookMutation {
    @Mutation(type => Book, "create", "books", "book")
    @CreateJoined("book_authors", "author")
    @Arg(type => GraphQLList(GraphQLInt), "authors", "A könyv szerzői.", true)
    @Arg(type => BookInputCreate, "book", "A létrehozandó könyv adatai.")
    createBook!: _Book;

    @Mutation(type => Book, "update", "books", "book")
    @Arg(type => BookInputUpdate, "book", "A könyv módosítandó adatai.")
    @Arg(type => GraphQLInt, "id", "A szerkesztendő könyv ID-ja.")
    updateBook!: _Book;

    @Mutation(type => GraphQLInt, "delete", "books")
    @Arg(type => GraphQLInt, "id", "A törlendő könyv ID-ja.")
    deleteBook!: number;

    @Mutation(type => Book, "join", "book_authors", "book")
    @Join("book", "book", "author", "author")
    @Arg(type => GraphQLInt, "author", "A szerző ID-ja.")
    @Arg(type => GraphQLInt, "book", "A könyv ID-ja.")
    joinBookToAuthor!: _Book;

    @Mutation(type => Book, "unjoin", "book_authors", "book")
    @Unjoin("book", "book", "author", "author")
    @Arg(type => GraphQLInt, "author", "A szerző ID-ja.")
    @Arg(type => GraphQLInt, "book", "A könyv ID-ja.")
    unjoinBookFromAuthor!: _Book;
}

const mutations = buildMutation(BookMutation, QueryRoot, productsDB);

export default mutations;
```

The `@Mutation` decorator shows that the framework must generate a mutation. The first parameter is a type (thunk) which will be returned upon completion of the mutation. The second parameter tells what kind of mutation resolver must be auto generated. Its possible values are `create`, `update`, `delete`, `join`, `unjoun`, `custom`. The third and forth parameters are the SQL table name and the query name corresponding to the report type.

The `@CreateJoined` decorator is used to create the joins in the junction table uppon creation of the data. E.g.: After the book is created, the author-book joins are created as well.

The `@Join` and `@Unjoin` decorators are used with `join` and `unjoin` type mutations, respectively. They are used to create or delete many-to-many relations between models. For example books and authors are in such relationship, one can add (join) an author to a given book or remove (unjoin) it from the book.

## Documentation

Comming soon....

## TODO

-   write tests
-   write documentation
-   typeguards
-   better error handling
-   enhance resolver generation features

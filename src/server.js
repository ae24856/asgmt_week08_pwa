const { ApolloServer, gql } = require('apollo-server');

let books = [
  {
    "id": "1",
    "title": "哈利波特",
    "author": "JK 羅琳",
    "isbn": "123456",
    "description": "一位平凡男孩，在十一歲生日那天得知自己是巫師，並踏入神秘的霍格華茲魔法學院。在友情、冒險與黑魔法的交織下，他逐步揭開自己與最強黑巫師之間的命運連結。",
    "coverImage": "/img/book.jpg",
    "tags": ["奇幻"]
  },
  {
    "id": "2",
    "title": "達文西密馬",
    "author": "abc",
    "isbn": "123456",
    "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。",
    "coverImage": "/img/book2.jpg",
    "tags": ["偵探"]
  },
  {
    "id": "3",
    "title": "白雪公主",
    "author": "abc",
    "isbn": "123456",
    "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。",
    "coverImage": "/img/book3.jpg",
    "tags": ["偵探", "愛情"]
  },
  {
    "id": "4",
    "title": "達文西密馬",
    "author": "abc",
    "isbn": "123456",
    "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。",
    "coverImage": "/img/book4.jpg",
    "tags": ["偵探", "奇幻"]
  }
];

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String!
    description: String
    coverImage: String
    tags: [String!]
  }

  input AddBookInput {
    title: String!
    author: String!
    isbn: String!
    description: String
    coverImage: String
    tags: [String!]
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(input: AddBookInput!): Book
    deleteBook(id: ID!): Book
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(b => b.id === id),
  },
  Mutation: {
    addBook: (_, { input }) => {
      const newBook = { id: Date.now().toString(), ...input };
      books.push(newBook);
      return newBook;
    },
    deleteBook: (_, { id }) => {
      const index = books.findIndex(b => b.id === id);
      if (index === -1) return null;
      const deleted = books.splice(index, 1);
      return deleted[0];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

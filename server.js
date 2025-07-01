const { ApolloServer, gql } = require('apollo-server');

// let books = [
//   {
//     "id": "1",
//     "title": "哈利波特",
//     "author": "JK 羅琳",
//     "isbn": "123456",
//     "description": "一位平凡男孩，在十一歲生日那天得知自己是巫師，並踏入神秘的霍格華茲魔法學院。在友情、冒險與黑魔法的交織下，他逐步揭開自己與最強黑巫師之間的命運連結。",
//     "coverImage": "/img/book.jpg",
//     "tags": ["奇幻"]
//   },
//   {
//     "id": "2",
//     "title": "達文西密馬",
//     "author": "abc",
//     "isbn": "123456",
//     "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。",
//     "coverImage": "/img/book2.jpg",
//     "tags": ["偵探"]
//   },
//   {
//     "id": "3",
//     "title": "白雪公主",
//     "author": "abc",
//     "isbn": "123456",
//     "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。",
//     "coverImage": "/img/book3.jpg",
//     "tags": ["偵探", "愛情"]
//   },
//   {
//     "id": "4",
//     "title": "達文西密馬",
//     "author": "abc",
//     "isbn": "123456",
//     "description": "一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。",
//     "coverImage": "/img/book4.jpg",
//     "tags": ["偵探", "奇幻"]
//   }
// ];

// API 的結構定義
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

  input UpdateBookInput {
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
    updateBook(id: ID!, input: UpdateBookInput!): Book
    deleteBook(id: ID!): Book
  }
`;

// 每一個查詢或修改動作的「實作」
const resolvers = {
  Query: {
    // books: () => books,
    books: async () => {
      const res = await fetch('http://localhost:3000/books');
      return await res.json();
    },    
    // book: (_, { id }) => books.find(b => b.id === id),
    book: async (_, { id }) => {
      const res = await fetch(`http://localhost:3000/books/${id}`);
      if (res.status === 404) return null;
      return await res.json();
    }
  },
  Mutation: {
    // fetch 這裡是呼叫 json-server 寫入資料
    addBook: async (_, { input }) => {
      const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      return await res.json();
    },
    updateBook: async (_, { id, input }) => {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return await res.json();
    },
    deleteBook: async (_, { id }) => {
      // 先查資料再刪除
      const res = await fetch(`http://localhost:3000/books/${id}`);
      if (res.status === 404) return null;
      const bookToDelete = await res.json();

      await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE'
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// server.listen({ host: '0.0.0.0', port: 4000 }).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
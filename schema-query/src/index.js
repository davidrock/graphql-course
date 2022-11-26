const { ApolloServer, gql } = require('apollo-server')
const { join } = require('node:path')
const { loadSchemaSync } = require('@graphql-tools/load')
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { addResolversToSchema } = require('@graphql-tools/schema')

const usuarios = [
  {
    id: 1,
    nome: 'David',
    idade: 32,
    email: 'david@email.com',
    perfil_id: 1
  },
  {
    id: 2,
    nome: 'Rafale',
    idade: 32,
    email: 'rafa@email.com',
    perfil_id: 1
  },
  {
    id: 3,
    nome: 'gabi',
    idade: 22,
    email: 'gabriela@email.com',
    perfil_id: 2
  }
]

const perfis = [{ id: 1, nome: 'Comum' }, { id: 2, nome: 'Administrador' }];

const resolvers = {
  Usuario: {
    salario(usuario) {
      console.log(usuario)
      return usuario.salario_real
    },
    perfil(usuario) {
      return perfis.find(x=> x.id == usuario.perfil_id);
    },
    taVelho(usuario){
      return usuario.idade > 30
    }
  },

  Produto: {
    precoComDesconto(produto) {
      if (produto.desconto) {
        return produto.preco - (produto.preco * produto.desconto)
      } else {
        return produto.preco
      }
    }
  },

  Query: {
    ola() {
      return 'Bom dia'
    },
    horaAtual() {
      return new Date
    },
    usuarioLogado() {
      return {
        id: 1,
        nome: 'David',
        idade: 32,
        email: 'david@email.com',
        salario_real: 12875.89,
        vip: true
      }
    },
    produtoEmDestaque() {
      return {
        nome: 'RTX 3070',
        preco: 400.00,
        desconto: 0.15,
      }
    },
    numerosMegaSena() {
      const crescente = (a, b) => a - b
      return Array(6).fill(0).map(() => parseInt(Math.random() * 60 + 1)).sort(crescente)
    },
    usuarios() {
      return usuarios;
    },
    usuario(_, args) {
      return usuarios.find(x => x.id == args.id)
    },
    perfis(){
      return perfis
    },
    perfil(_, args) {
      return perfis.find(x=> x.id == args.id);
    }
  },
}

const schema = loadSchemaSync(join(__dirname, './schemas/index.graphql'), { loaders: [new GraphQLFileLoader()] })
const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

const server = new ApolloServer({
  schema: schemaWithResolvers
});

server.listen().then(({ url }) => {
  console.log(`Executando em ${url}`)
});
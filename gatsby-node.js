const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const dsg = createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  });

  const posts = graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }`).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
          path: node.fields.slug,
          component: require.resolve("./src/templates/blog-post.js"),
          context: {
            slug: node.fields.slug
          }
        })
      })
    });

  return Promise.all([dsg, posts]);
}


exports.onCreateNode = async({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}
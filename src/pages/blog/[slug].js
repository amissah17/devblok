import { gql, GraphQLClient } from "graphql-request";
import { MDXRemote } from "next-mdx-remote";
import {serialize} from "next-mdx-remote/serialize";
import rehypePrism from 'rehype-prism-plus';
import rehypeCodeTitles from 'rehype-code-titles';
import style from "@/styles/Slug.module.css";
import Image from "next/image";

export async function getStaticPaths() {
  const url = "https://gapi.storyblok.com/v1/api";

  const client = new GraphQLClient(url, {
    headers: {
      token: process.env.PublicToken,
      version: "published",
    },
  });

  const querySlug = gql`
    {
      BlogpostItems {
        items {
          slug
        }
      }
    }
  `;

  const { BlogpostItems } = await client.request(querySlug);
  const paths = BlogpostItems.items.map(({slug}) =>  ({ params: {slug} }));
  return { paths , fallback: "blocking" };
}

export async function getStaticProps({params}) {
  const url = "https://gapi.storyblok.com/v1/api";

  const client = new GraphQLClient(url, {
    headers: {
      token: process.env.PublicToken,
      version: "published",
    },
  });

  const query = gql`
  query mypost($id: ID!){
    BlogpostItem(id: $id){
      name
      content {
        Date
        Author{
          name
        }
        Article_Body
        Featured_Image {
          filename
          alt
        }
      }
    }
  }`;
// fetching data from Storyblok
  const { BlogpostItem } = await client.request(query, {id: `posts/${params.slug}`});
  
  const {name, content} = BlogpostItem;
  const source = await serialize(BlogpostItem.content.Article_Body, { mdxOptions: {
    rehypePlugins: [rehypeCodeTitles, rehypePrism]
  }})
  
  return { props: { Source: source, name, content } };
}

function SinglePost({ Source , name, content }) {
  return (
 
  <div className={style.wrapper}>
    
    <div className={style.imgWrapper}>
      <Image src={content.Featured_Image.filename} alt={content.Featured_Image.alt} fill />
  </div>
  <div><h1>{name}</h1></div>
  <div className={style.postContent}>

    <div>
      <MDXRemote {...Source}/>
    </div>
  </div>
  </div>);
}

export default SinglePost;

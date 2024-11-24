import rss from '@astrojs/rss';
import { getCollection } from "astro:content";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({ html: true });

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'Blog de ComiDólar',
    description: 'Todas las últimas publicaciones de ComiDólar a través de su blog oficial. Noticias del dólar, del CNBA y mucho más.',
    site: context.site,
    items: blog.map((post) => {
      // Permitir todas las etiquetas y atributos
      const contentHtml = sanitizeHtml(parser.render(post.body), {
        allowedTags: false, // Permitir todas las etiquetas
        allowedAttributes: false, // Permitir todos los atributos
      });
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        categories: post.data.tags,
        author: post.data.author,
        link: `/blog/${post.slug}/`,
        content: contentHtml,
      };
    }),
    customData: [
      '<language>es-es</language>',
      `<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${new URL('rss.xml', context.site)}" rel="self" type="application/rss+xml" />`
    ].join(''),    
  });
}
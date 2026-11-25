import type { APIRoute } from "astro";
const paths=["/","/platform/","/solutions/rent-a-car/","/solutions/used-car-showrooms/","/solutions/workshops/","/solutions/car-detailing/"];
export const GET:APIRoute=({site})=>{
 const lastmod=new Date().toISOString().slice(0,10);
 const urls=paths.map(path=>`<url><loc>${new URL(path,site).href}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n");
 return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,{headers:{"Content-Type":"application/xml; charset=utf-8"}});
};

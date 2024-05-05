import { readFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'fs'; // Fix: Replace import statement
import http from 'node:http'; // Fix: Add missing import statement for 'http' module
const hostname = '127.0.0.1'; // setear la ip de la maquina
const port = 3000; // puerto al cual se conectara el servidor
const server = http.createServer(async (req, res) => {
  const url = req.url; // obtener la url de la peticion
  console.log(url); // mostrar la url en consola
  try {
    if (req.method === 'GET') {
      const data = await readFile(`.${url}`, 'utf-8'); // leer el archivo de la url y crear una constante con el contenido
      const logEntry = `${new Date().toISOString()} - ${url}\n`; // crear una constante con la fecha y la url
      await appendFile('request.log', logEntry); // agregar la constante al archivo requests.log
      if (url === '/requests.log') { // si la url es /requests.log
        res.writeHead(403); // setear el status code a 403
        res.end('Acceso prohibido'); // enviar la respuesta
      } else if (existsSync(`.${url}`)) { // si el archivo existe
        try { // intentar leer el archivo
          const data = await readFile(`.${url}`, 'utf-8'); // leer el archivo
          if (url.endsWith('.html')) { // si la url termina en .html
            res.setHeader('Content-Type', 'text/html');
          } else { // si no
            res.setHeader('Content-Type', 'text/plain');
          }
          res.statusCode = 200; // setear el status code a 200
          res.end(data, 'utf-8');
        } catch (error) { // si hay un error
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`${url} Not found`, 'utf-8');
        }
      } else if (url === '/' || url === '/index' || url === '/index.html') { // si la url es /, /index o /index.html
        const data = await readFile('./index.html', 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data, 'utf-8');
      }
    } else { //metodo no permitido
      res.statusCode = 405;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Method not allowed', 'utf-8');
    }
  } catch (error) {
    res.statusCode = 404; // setear el status code
    res.setHeader('Content-Type', 'text/plain'); // setear el content type a texto plano
    res.end(`${url} Not found`, 'utf-8'); // enviar la respuesta
  }
});
/* TAREA: Modificar el servidor actual con las siguientes condiciones:
 * responde solo GET (ultimo) //listo
 * responder el archivo de la ruta y manejar errores //listo
 * si es extension html responder con el content-type correcto sino text/plain  //listo
 * si no existe el archivo responder con 404 Not Found //ok
 * generar un archivo requests.log donde se almacene la fecha y la ruta de la peticion (mostrar un error por consola si requests.log no existe) // listo
 * evitar que se pueda hacer un request a requests.log // listo
 * devolver status code adecuado SIEMPRE // listo
 * si el path del request es / /index /index.html debe devolver index.html 
 * opcional: devolver el favicon
 */

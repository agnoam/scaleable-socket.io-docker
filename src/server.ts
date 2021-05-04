
import bodyParser from "body-parser";
import express, { Application } from "express";
import os from "os";
import { ServerMiddleware } from "./middlewares/server.middleware";
import { RoutesConfig } from "./config/routes.config";
import http from "http";
import * as SocketIO from "socket.io";
import { createAdapter } from 'socket.io-redis';
import { SocketEventsHandler } from './components/socket.ctrl';
// import { ElasticService } from "./config/elasticsearch.config";
import { RedisClient } from "redis";
import cors from 'cors';
import { SocketMiddleare } from "./middlewares/socket.middleware";

// Loading .env file
import dotenv from 'dotenv';
dotenv.config();

export module ServerRoot {
  const port: number = +process.env.PORT || 8810;
  export const app: Application = express();
  const server: http.Server = createServer();
  const publishRedisClient: RedisClient = new RedisClient({ host: process.env.REDIS_HOST, port: +process.env.REDIS_PORT });
  const subscribeRedisClient: RedisClient = publishRedisClient.duplicate();

  export const io: SocketIO.Server = getSocket(server);
  // export const elasticService: ElasticService = new ElasticService();

  function createServer(): http.Server {
    return http.createServer(app);
  }

  function getSocket(server: http.Server): SocketIO.Server {
    try {
      return new SocketIO.Server(server, { 
        transports: ['websocket', 'polling'],
        adapter: createAdapter({ 
          pubClient: publishRedisClient, subClient: subscribeRedisClient 
        }) 
      });
    } catch(ex) {
      console.error('Socket.IO exception:', ex);
    }
  }

  export const listen = (): void => {
    loadMiddlewares();
    configModules();
    
    const localIP: string = findMyIP();

    server.listen(port, () => {
      console.log(`Our app server is running on http://${os.hostname()}:${port}`);
      console.log(`Server running on: http://${localIP}:${port}`);
    });
  }

  function configModules(): void {
    RoutesConfig(app);
    SocketEventsHandler(io);
  }

  function loadMiddlewares(): void {
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded({ extended: true }) );
    app.use( cors() );
    app.use( ServerMiddleware );

    SocketMiddleare(io);
  }

  function findMyIP(): string {
    // Get the server's local ip
    const ifaces: NetworkInterface = os.networkInterfaces();
    let localIP: string;

    Object.keys(ifaces).forEach((ifname) => {
      let alias: number = 0;

      ifaces[ifname].forEach((iface) => {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias < 1) {
          localIP = iface.address;
        }
        
        ++alias;
      });
    });

    return localIP;
  }
} 

interface NetworkInterface {
  [index: string]: os.NetworkInterfaceInfo[];
}

// Running the server
ServerRoot.listen();
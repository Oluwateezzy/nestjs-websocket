import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { ServerOptions } from "socket.io";

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
        const pubClient = createClient({
            url: "redis://default:NqUtiVzD5t0VNdcVNJsZxm3NzD0NCEmA@redis-13306.c16.us-east-1-2.ec2.redns.redis-cloud.com:13306"
        });

        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options)
        server.adapter(this.adapterConstructor)
        return server
    }
}

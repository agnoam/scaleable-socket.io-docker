# Kubernetes multi socket example
This is node.js kubernetes example of multi-deployment project contains:

* RabbitMQ deployment (x1 replica)
* Node.js (Typescript) Socket.io handler (x3 replicas)

## How to use
1. You must have `docker` on your machine.
2. You must have `kubernetes` too.
3. Open `Command Propmt` or `Terminal` on this folder, and run `docker build . -t socket-handler`
5. Run `kubectl apply -f .\kubernetes` for Windows 
and `kubectl apply -f ./kubernetes` for Linux
6. You can check if everything go smooth by `kubectl get all` command
7. You can access `localhost:3000` as soon as `rabbitmq` and `socket-handler` deployments are at `Running` status
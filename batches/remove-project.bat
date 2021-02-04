echo Removing all project's data

kubectl delete deployment socket-handler rabbitmq
kubectl delete service socket-handler-service rabbitmq-service
kubectl delete secret rabbitmq-secrets
kubectl delete configmap rabbitmq-config

echo All data removed
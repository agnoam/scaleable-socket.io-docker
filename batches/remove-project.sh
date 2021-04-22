echo "Removing all project's data"

kubectl delete deployment socket-handler redis kibana elasticsearch
kubectl delete service socket-handler-service redis-service kibana-service elasticsearch-service
kubectl delete pvc elasticsearch-volume-claim
kubectl delete pv elasticsearch-volume
kubectl delete configmap kibana-configmap

echo "All data removed"
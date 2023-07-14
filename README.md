# Child workflows issue

This is a repo to reproduce an issue with child workflows.
To reproduce the issue, stop the worker right after the timer finishes (after 'Will start child workflows' log)
This can lead to situation, when child workflow id is registered, but run id is not assigned.
In this case workflow execution will stop forever.

Was reproduced on temporal 1.20.3 with cassandra db

To run the example:
1. Start temporal server (can use docker-compose from ./temporal_docker/docker-compose-temporal.yml, although with 
provided setup it was a bit different issue)
2. Run `npm start` to start worker
3. Run `npm run workflow` to run client, which will start workflow
4. Stop worker right after the timer finishes (after 'Will start child workflows' log)

With provided docker compose error was a bit different, it was:

on worker logs:
```
2023-07-14T13:11:01.082443Z  WARN temporal_client::retry: gRPC call poll_workflow_task_queue retried 15 times error=Status { code: DataLoss, message: "corrupted history event batch, eventID is not contiguous", metadata: MetadataMap { headers: {"content-type": "application/grpc"} }, source: None }
```
on temporal server logs:
```
{"level":"error","ts":"2023-07-14T13:08:23.179Z","msg":"service failures","operation":"PollWorkflowTaskQueue","wf-namespace":"default","error":"corrupted history event batch, eventID is not contiguous","logging-call-at":"telemetry.go:295","stacktrace":"go.temporal.io/server/common/log.(*zapLogger).Error\n\t/home/builder/temporal/common/log/zap_logger.go:150\ngo.temporal.io/server/common/rpc/interceptor.(*TelemetryInterceptor).handleError\n\t/home/builder/temporal/common/rpc/interceptor/telemetry.go:295\ngo.temporal.io/server/common/rpc/interceptor.(*TelemetryInterceptor).Intercept\n\t/home/builder/temporal/common/rpc/interceptor/telemetry.go:166\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.temporal.io/server/service/frontend.(*RedirectionInterceptor).handleRedirectAPIInvocation.func2\n\t/home/builder/temporal/service/frontend/redirection_interceptor.go:227\ngo.temporal.io/server/service/frontend.(*NoopRedirectionPolicy).WithNamespaceRedirect\n\t/home/builder/temporal/service/frontend/dcRedirectionPolicy.go:125\ngo.temporal.io/server/service/frontend.(*RedirectionInterceptor).handleRedirectAPIInvocation\n\t/home/builder/temporal/service/frontend/redirection_interceptor.go:224\ngo.temporal.io/server/service/frontend.(*RedirectionInterceptor).Intercept\n\t/home/builder/temporal/service/frontend/redirection_interceptor.go:184\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.temporal.io/server/common/metrics.NewServerMetricsContextInjectorInterceptor.func1\n\t/home/builder/temporal/common/metrics/grpc.go:66\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc.UnaryServerInterceptor.func1\n\t/go/pkg/mod/go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc@v0.36.4/interceptor.go:341\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.temporal.io/server/common/rpc/interceptor.(*NamespaceLogInterceptor).Intercept\n\t/home/builder/temporal/common/rpc/interceptor/namespace_logger.go:84\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.temporal.io/server/common/rpc/interceptor.(*NamespaceValidatorInterceptor).NamespaceValidateIntercept\n\t/home/builder/temporal/common/rpc/interceptor/namespace_validator.go:111\ngoogle.golang.org/grpc.getChainUnaryHandler.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1164\ngo.temporal.io/server/common/rpc.ServiceErrorInterceptor\n\t/home/builder/temporal/common/rpc/grpc.go:137\ngoogle.golang.org/grpc.chainUnaryInterceptors.func1\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1155\ngo.temporal.io/api/workflowservice/v1._WorkflowService_PollWorkflowTaskQueue_Handler\n\t/go/pkg/mod/go.temporal.io/api@v1.18.2-0.20230324225508-f2c7ab685b44/workflowservice/v1/service.pb.go:1518\ngoogle.golang.org/grpc.(*Server).processUnaryRPC\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1345\ngoogle.golang.org/grpc.(*Server).handleStream\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:1722\ngoogle.golang.org/grpc.(*Server).serveStreams.func1.2\n\t/go/pkg/mod/google.golang.org/grpc@v1.54.0/server.go:966"}
```

And it occurred after cluster restart, while run ids are not assigned yet.
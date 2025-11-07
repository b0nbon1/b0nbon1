---
title: "The Three Pillars of Observability: Metrics, Logs, and Traces explained"
featured: True
date: 2025-11-02T22:00:00+0300
description: Learn the three pillars of observability - metrics, logs, and traces. Understand how they work together to monitor and debug distributed systems. ~ Bonvic Bundi
tags: 
     - Observability
     - Metrics
     - Logs
     - Traces
     - Golang
author: Bonvic Bundi
---

Imagine you’re flying an airplane ✈️. You’re the pilot, cruising at 35,000 feet. Everything looks fine—until suddenly, the plane shakes a little. Now you need to know what’s going on:
- Is it turbulence?
- Did an engine hiccup?
- Or is it just a sensor glitch?

To figure that out, you rely on three things:
- The dashboard (metrics) — shows altitude, fuel, speed, temperature.
- The black box (logs) — records everything that happened in detail.
- The flight path recorder (traces) — shows the exact path and sequence of events that led to the issue.

That's exactly how observability works in software systems. When your app "shakes"—runs slow, crashes, or misbehaves—you need these three things to understand what's happening inside.

> Just a note: There are different tools to do observability, the mentioned below are just my preferences or what I'm familiar with.

## 🧮 1. Metrics — Your System's Dashboard
Metrics are like the cockpit instruments that tell you how your system is performing at a glance: CPU usage, request latency, error rate, memory consumption, number of users online, and more. They don't tell you the story, but they tell you something's off.

In any backend, you typically:
- Expose metrics in a /metrics endpoint (in a text or JSON format)
- Use a scraper like Prometheus to collect them
- Visualize them using Grafana

This concept is universal—in Go, Python, Java, or Node.js—the same flow applies. The main difference is how you expose and register the metrics.

**Example (Go + Prometheus)**
```go
package main

import (
    "fmt"
    "net/http"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    requestCount = prometheus.NewCounter(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Number of requests received",
        },
    )
)

func handler(w http.ResponseWriter, r *http.Request) {
    requestCount.Inc()
    fmt.Fprintf(w, "Hello, Observability!")
}

func main() {
    prometheus.MustRegister(requestCount)
    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

What’s happening here:
1. `prometheus.NewCounter` creates a counter metric that increases with every HTTP request.
2. `prometheus.MustRegister` registers that metric so Prometheus can scrape it.
3. `/metrics` endpoint exposes all metrics in Prometheus’ readable format.
4. When you hit `/`, the counter increments — and you can see that value when Prometheus scrapes your app.

You'd connect Grafana to Prometheus to visualize metrics like requests per second or latency trends. Learn more about this on [Prometheus](https://prometheus.io/).

**Best Practices**
- Use clear, consistent names (e.g., `http_request_duration_seconds`).
- Label metrics for easy filtering (path, method, status).
- Alert when thresholds break (e.g., high latency or error rate).
- Monitor SLOs—e.g., 99% of requests respond under 300ms.

## 🧾 2. Logs — Your Black Box Recorder
If the plane shakes, metrics will tell you that something happened, but logs tell you what exactly happened.
Logs are detailed records of what happened in your system — like “engine 2 overheated” or “autopilot disengaged.” In your application, logs capture every action, request, and error with context. They tell the story behind the metrics: what failed and why. They’re especially useful for debugging and post-mortem analysis.

In any backend, logs are usually:
- Set up with logging collection tools like Loki and Promtail
- Written to stdout or files using tools or default loggers like Zap or the Go standard logger
- Collected by tools like Loki, Fluentd, CloudWatch, or Elastic Stack
- Queried and visualized in Grafana

**Example (Zap logger + Loki)**

Configure Loki first for log collection. Follow this [setup guide](https://grafana.com/docs/loki/latest/get-started/quick-start/quick-start/).

```go
package main

import (
    "go.uber.org/zap"
    "os"
)

func main() {
    // Create a directory for logs if it doesn't exist
    _ = os.MkdirAll("logs", os.ModePerm)

    // Configure zap logger to write to file
    cfg := zap.NewProductionConfig()
    cfg.OutputPaths = []string{
        "stdout",             // Print logs to console
        "logs/app.log",       // Save logs to file for Promtail
    }

    logger, err := cfg.Build()
    if err != nil {
        panic(err)
    }
    defer logger.Sync()

    sugar := logger.Sugar()

    sugar.Info("Application starting up 🚀")
    sugar.Warn("Cache miss detected, fetching from DB")
    sugar.Error("Failed to connect to service: retrying...")

    sugar.Info("Application running smoothly ✈️")
}
```

Logs can be shipped to Grafana Loki, Elasticsearch, or CloudWatch. They're structured (in JSON), making them easy to search and analyze.

**What's Happening Here:**
1. Zap is configured to log both to the console (stdout) and to a file (logs/app.log).
2. Promtail continuously reads logs/app.log and sends those log entries to Loki.
3. Grafana (if connected) can visualize, search, and filter logs from Loki.

**Best Practices**
- Use structured logs (JSON) instead of plain text.
- Include context — request ID, user ID, correlation ID.
- Redact sensitive data (passwords, tokens).
- Centralize logs — never rely on local files in containers.

## 🔍 3. Traces — Your Flight Path Recorder

Traces connect everything — they show the journey of a single request as it moves through different services, databases, or APIs. Each operation is a “span,” and all spans together form the trace. If your airplane went off course, the flight path recorder tells you which part of the route caused the deviation. In microservices, traces do the same — they reveal bottlenecks and slow dependencies.

In any backend:
- You instrument your code with OpenTelemetry or Jaeger SDK
- Each request generates a trace ID
- That trace ID is passed across services
- Jaeger or Tempo visualizes the journey

**Example (Go + OpenTelemetry + Jaeger)**
```go
package main

import (
    "context"
    "fmt"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/trace"
)

func main() {
    exp, _ := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint("http://localhost:14268/api/traces")))
    tp := trace.NewTracerProvider(trace.WithBatcher(exp))
    otel.SetTracerProvider(tp)

    tracer := otel.Tracer("my-go-app")
    ctx, span := tracer.Start(context.Background(), "handleRequest")
    fmt.Println("Tracing request...")
    span.End()
}
```

**What's happening here:**
What’s happening here:
- We configure the Jaeger exporter to send traces to Jaeger.
- Create a tracer and start a span called `handleRequest`.
- When the span ends, the trace is sent—showing timing and service info.
- Jaeger UI lets you visualize the entire path of the request across services.

**Best Practices for Traces**
- Use OpenTelemetry for vendor-neutral instrumentation.
- Propagate trace context between services (`traceparent` headers).
- Sample wisely—not all traces need to be stored.
- Combine traces with metrics and logs for full context.

## Wrapping It All Up
In a well-observed service or application:
- Metrics show when something goes wrong.
- Logs show why it went wrong.
- Traces show where it went wrong.

For example:
- You see in Grafana (metrics) that latency has spiked.
- You check Loki (logs) for that service to see the actual error message.
- You open Jaeger (traces) to find which microservice is slow.

This layered visibility helps teams detect issues early, debug faster, and maintain higher reliability in our applications.

| Pillar      | Purpose                       | Common Go Tools            | Observability Platform | Best Practice                            |
| ----------- | ----------------------------- | -------------------------- | ---------------------- | ---------------------------------------- |
| **Metrics** | Quantitative performance data | `prometheus/client_golang` | Prometheus + Grafana   | Track latency, error rates, SLOs         |
| **Logs**    | Detailed contextual events    | `zap`, `logrus`            | Loki / ELK Stack       | Structured logs, add context, centralize |
| **Traces**  | End-to-end request flow       | `opentelemetry-go`         | Jaeger / Tempo         | Correlate with logs and metrics          |

Observability isn't just about tools—it's about understanding your system deeply. By combining metrics, logs, and traces, you turn your Go applications into transparent systems where no failure hides for long. Together, they give you confidence to ship faster, scale safely, and sleep better—knowing you can always see what's going on under the hood.

If you have any questions or experiences, drop them in the comment section below.

Thanks for reading, cheers 🥂

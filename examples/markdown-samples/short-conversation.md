# Rate-limiter sketch

> Created: 2026-04-20 14:12 | Updated: 2026-04-20 14:18

---

## Human (2026-04-20 14:12):

I need a simple in-memory rate limiter in Python — 10 requests per minute per user.
What's the cleanest way?

---

## Claude (2026-04-20 14:13):

A sliding-window counter with a deque per user is the most readable starting point.
Here's a minimal version:

```python
from collections import deque
from time import monotonic

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = {}

    def allow(self, user_id: str) -> bool:
        now = monotonic()
        hits = self._hits.setdefault(user_id, deque())
        # Drop expired hits at the front
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.max_requests:
            return False
        hits.append(now)
        return True

# Usage: 10 requests per 60 seconds per user.
limiter = RateLimiter(max_requests=10, window_seconds=60)
```

A few notes:

- `monotonic()` is the right clock — it never goes backwards, unlike `time.time()`.
- Eviction happens on access, so idle users eventually get their deques cleaned up
  naturally. For tight memory budgets, add a periodic sweep.
- For multi-process setups (uvicorn workers, Gunicorn), this counts per-process. Move
  to Redis with `INCR` + `EXPIRE` if you need global fairness.

---

## Human (2026-04-20 14:17):

How would the Redis version look?

---

## Claude (2026-04-20 14:18):

Here's the idiomatic pattern using a fixed-window counter (simpler than sliding; good
enough for most cases):

```python
import redis
from time import time

r = redis.Redis()

def allow(user_id: str, max_requests: int = 10, window_seconds: int = 60) -> bool:
    window = int(time()) // window_seconds
    key = f"rate:{user_id}:{window}"
    count = r.incr(key)
    if count == 1:
        r.expire(key, window_seconds)
    return count <= max_requests
```

The key embeds the current window bucket so keys auto-rotate. `expire` only gets set
on the first hit in a new bucket, which is correct — resetting TTL on every hit would
let a user spam requests indefinitely if they paced them right.

If you need true sliding-window semantics in Redis, `ZADD` + `ZREMRANGEBYSCORE` on a
sorted set works, but it's more expensive per request. Start with the fixed-window
version and only upgrade if you see unfair behavior at window boundaries.

---

Exported with [AI Chat Archive](https://aichatarchive.app) · Runs entirely in your browser
